<?php

use Faker\Generator as Faker;

$factory->define(App\Company::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'catchPhrase' => $faker->name,
        'bs' => $faker->bs,
    ];
});
