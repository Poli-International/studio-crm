<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Staff;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Database\Seeders\DatabaseSeeder;

class ProductionReadinessTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the database can be seeded correctly.
     */
    public function test_database_seeding_works(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->assertDatabaseHas('staff', ['email' => 'marcus@studio.com']);
        $this->assertDatabaseHas('clients', ['email' => 'sarah.m@email.com']);
        $this->assertGreaterThan(0, \App\Models\Appointment::count());
        $this->assertGreaterThan(0, \App\Models\Inventory::count());
    }

    /**
     * Test that login works with seeded credentials.
     */
    public function test_admin_can_login(): void
    {
        $this->seed(DatabaseSeeder::class);

        $response = $this->post('/login', [
            'email' => 'marcus@studio.com',
            'password' => 'password',
        ]);

        $response->assertRedirect('/');
        $this->assertTrue(session('authenticated'));
        $this->assertEquals('admin', session('user_role'));
    }

    /**
     * Test that unauthorized users are redirected to login.
     */
    public function test_unauthenticated_users_are_redirected(): void
    {
        $response = $this->get('/clients');
        $response->assertRedirect('/login');
    }

    /**
     * Test that artists cannot access team management (RBAC).
     */
    public function test_artists_cannot_access_team_management(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Login as artist
        $this->withSession([
            'authenticated' => true,
            'user_id' => 2, // Yuki
            'user_role' => 'artist'
        ]);

        $response = $this->get('/team');
        $response->assertStatus(403);
    }

    /**
     * Test that admins can access team management.
     */
    public function test_admins_can_access_team_management(): void
    {
        $this->seed(DatabaseSeeder::class);

        // Login as admin
        $this->withSession([
            'authenticated' => true,
            'user_id' => 1, // Marcus
            'user_role' => 'admin'
        ]);

        $response = $this->get('/team');
        $response->assertStatus(200);
    }
}
