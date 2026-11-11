create table if not exists public.zumra_payments (
  id uuid primary key default gen_random_uuid(),
  core_identity_reference text not null
    references public.zumra_memberships(core_identity_reference) on delete cascade,
  provider text not null check (provider in ('geniuspay')),
  purpose text not null check (purpose in ('membership')),
  reference text not null unique,
  provider_id text,
  amount integer not null check (amount >= 200),
  currency text not null default 'XOF' check (currency = 'XOF'),
  environment text not null check (environment in ('sandbox', 'live')),
  status text not null
    check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded')),
  checkout_url text,
  fees integer,
  net_amount integer,
  provider_payload jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists zumra_payments_member_created_idx
  on public.zumra_payments(core_identity_reference, created_at desc);
create index if not exists zumra_payments_status_idx
  on public.zumra_payments(status);

alter table public.zumra_payments enable row level security;

drop trigger if exists zumra_payments_touch_updated_at on public.zumra_payments;
create trigger zumra_payments_touch_updated_at
before update on public.zumra_payments
for each row execute function public.zumra_touch_updated_at();

create or replace function public.zumra_confirm_membership_payment(
  p_reference text,
  p_provider_status text,
  p_provider_payload jsonb default '{}'::jsonb,
  p_fees integer default null,
  p_net_amount integer default null,
  p_completed_at timestamptz default null
)
returns table(membership_status text, payment_status text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment public.zumra_payments%rowtype;
begin
  if p_provider_status not in ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded') then
    raise exception 'STATUT_PAIEMENT_INVALIDE';
  end if;

  update public.zumra_payments
  set status = p_provider_status,
      provider_payload = coalesce(p_provider_payload, '{}'::jsonb),
      fees = coalesce(p_fees, fees),
      net_amount = coalesce(p_net_amount, net_amount),
      completed_at = case
        when p_provider_status = 'completed' then coalesce(p_completed_at, completed_at, now())
        else completed_at
      end
  where reference = p_reference
  returning * into v_payment;

  if v_payment.id is null then
    raise exception 'PAIEMENT_INTROUVABLE';
  end if;

  if p_provider_status = 'completed' and v_payment.purpose = 'membership' then
    update public.zumra_memberships
    set status = 'active',
        member_since = coalesce(member_since, now())
    where core_identity_reference = v_payment.core_identity_reference
      and status = 'pending_payment';
  end if;

  return query
  select m.status, v_payment.status
  from public.zumra_memberships m
  where m.core_identity_reference = v_payment.core_identity_reference;
end;
$$;

revoke all on function public.zumra_confirm_membership_payment(text, text, jsonb, integer, integer, timestamptz) from public;
revoke all on function public.zumra_confirm_membership_payment(text, text, jsonb, integer, integer, timestamptz) from anon;
revoke all on function public.zumra_confirm_membership_payment(text, text, jsonb, integer, integer, timestamptz) from authenticated;
grant execute on function public.zumra_confirm_membership_payment(text, text, jsonb, integer, integer, timestamptz) to service_role;

comment on table public.zumra_payments is
  'Paiements ZUMRA. La V1 utilise GeniusPay en sandbox et ne doit jamais etre confondue avec des transactions reelles.';
