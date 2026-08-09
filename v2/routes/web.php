<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn () => Inertia::render('Public/Home', [
    'poles' => [
        ['id' => 'numerique', 'name' => 'Pôle Numérique', 'kicker' => 'Technologie & outils', 'description' => 'Créer, automatiser, héberger et équiper les activités de l’écosystème.'],
        ['id' => 'production', 'name' => 'Production & Métiers', 'kicker' => 'Économie réelle', 'description' => 'Agriculture, artisanat, fabrication, maintenance et métiers techniques.'],
        ['id' => 'commerce', 'name' => 'Commerce & Services', 'kicker' => 'Marchés & prestations', 'description' => 'Mettre en relation offres, besoins, professionnels et opportunités commerciales.'],
        ['id' => 'formation', 'name' => 'Compétences & Formation', 'kicker' => 'Apprendre & transmettre', 'description' => 'Développer les capacités humaines puis les mettre en pratique.'],
    ],
]))->name('home');

Route::get('/app', fn () => Inertia::render('App/Home', [
    'profile' => [
        'firstName' => 'Membre',
        'profileCompletion' => 42,
        'nextAction' => 'Ajoutez deux compétences pour améliorer les recommandations.',
    ],
    'poles' => [
        ['id' => 'numerique', 'name' => 'Numérique'],
        ['id' => 'production', 'name' => 'Production & Métiers'],
        ['id' => 'commerce', 'name' => 'Commerce & Services'],
        ['id' => 'formation', 'name' => 'Compétences & Formation'],
    ],
]))->name('app.home');

Route::get('/app/zumra', fn () => Inertia::render('App/Zumra/Index', [
    'membership' => ['status' => 'active'],
    'activity' => [
        ['kind' => 'need', 'title' => 'Une Zumra recherche une compétence en design packaging', 'meta' => 'Pôle Production · il y a 2 h'],
        ['kind' => 'learning', 'title' => 'Atelier Excel avancé ouvert aux membres', 'meta' => 'Compétences & Formation · aujourd’hui'],
        ['kind' => 'project', 'title' => 'Projet de transformation locale : équipe en constitution', 'meta' => '3 capacités recherchées'],
    ],
]))->name('app.zumra');
