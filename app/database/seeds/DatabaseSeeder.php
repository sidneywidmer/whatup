<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		//ungoard to allow massassignment
		Eloquent::unguard();

		$this->call('DefaultRoomsSeeder');
        $this->command->info('Default rooms were added to DB');
	}

}