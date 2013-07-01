<?php

class DefaultRoomsSeeder extends Seeder {

    public function run()
    {
        DB::table('rooms')->delete();
        Room::create(array('name' => 'lobby'));
    }

}