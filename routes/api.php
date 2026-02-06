<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FinancialController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\ComplianceController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\SalesController;
use App\Http\Controllers\OnlineStoreIntegrationController;
use App\Http\Controllers\ClientPortalController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Client Portal Public Routes
Route::post('/portal/register', [ClientPortalController::class, 'register']);
Route::post('/portal/login', [AuthController::class, 'login']); // Reusing logic for now

/*
|--------------------------------------------------------------------------
| Client Portal (Protected)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->prefix('portal')->group(function () {
    Route::get('/me', [ClientPortalController::class, 'me']);
    Route::post('/upload-design', [ClientPortalController::class, 'uploadDesign']);
    Route::get('/my-appointments', [AppointmentController::class, 'index']); // Filtered by user in controller
});

/*
|--------------------------------------------------------------------------
| Studio/Staff Management (Protected)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Clients
    Route::apiResource('clients', ClientController::class);
    Route::get('clients/{id}/history', [ClientController::class, 'history']);
    Route::get('clients/{id}/forms', [ClientController::class, 'forms']);

    // Appointments (Calendar)
    Route::apiResource('appointments', AppointmentController::class);
    Route::get('calendar-events', [AppointmentController::class, 'events']);
    Route::patch('appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

    // Services (Technical session logs)
    Route::post('services', [ServiceController::class, 'store']);
    Route::get('services/{id}', [ServiceController::class, 'show']);
    Route::post('services/{id}/photos', [ServiceController::class, 'uploadPhoto']);

    // Financial & Retail Sales
    Route::get('financial/dashboard', [FinancialController::class, 'dashboard']);
    Route::apiResource('financial', FinancialController::class)->only(['index', 'store']);
    Route::post('sales', [SalesController::class, 'store']);

    // Vault (MSDS, Certificates, Licenses)
    Route::get('vault', [DocumentController::class, 'index']);
    Route::post('vault/upload', [DocumentController::class, 'store']);
    Route::get('vault/{id}/download', [DocumentController::class, 'download']);

    // Online Store Integration
    Route::post('integration/online-sale', [OnlineStoreIntegrationController::class, 'handleWebhook']);

    // Inventory & Compliance
    Route::apiResource('inventory', InventoryController::class);
    Route::apiResource('compliance', ComplianceController::class);
    
});
