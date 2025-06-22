<?php

use Inertia\Inertia;
use App\Models\TransactionPoint;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PrizeController;
use App\Http\Controllers\EmployeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\MasterPointController;
use App\Http\Controllers\ClaimHistoryController;
use App\Http\Controllers\TransactionPointController;

// Route::get('/', function () {
//     return Inertia::render('Home/Index', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// })->name('home');

Route::get('/',[HomeController::class, 'index'])->name('home');

Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard.index');
Route::get('/leaderboard/departments', [LeaderboardController::class, 'departmentRankings'])->name('leaderboard.departments');
Route::get('/leaderboard/top-performers', [LeaderboardController::class, 'topPerformers'])->name('leaderboard.top-performers');
Route::get('/leaderboard/employee/{employee}', [LeaderboardController::class, 'employeeDetail'])->name('leaderboard.employee');

// Super Admin only routes
Route::middleware(['auth', 'role:super_admin'])->group(function () {
    Route::resource('roles', RoleController::class);
});

Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {

    Route::controller(EmployeController::class)->group(function () {
        Route::get('/employe', 'index')->name('admin.employe.index');
        Route::get('employe/create', 'create')->name('admin.employe.create');
        Route::post('employe', 'store')->name('admin.employe.store');
        Route::get('employe/edit/{employe}', 'edit')->name('admin.employe.edit');
        Route::put('employe/{employe}', 'update')->name('admin.employe.update');
        Route::delete('employe/destroy/{employe}', 'destroy')->name('admin.employe.destroy');

    });
    Route::controller(MasterPointController::class)->group(function () {
        Route::get('/master-point', 'index')->name('admin.master-point.index');
        Route::get('master-point/create', 'create')->name('admin.master-point.create');
        Route::post('master-point', 'store')->name('admin.master-point.store');
        Route::get('master-point/edit/{masterpoint}', 'edit')->name('admin.master-point.edit');
        Route::put('master-point/{masterpoint}', 'update')->name('admin.master-point.update');
        Route::delete('master-point/destroy/{masterpoint}', 'destroy')->name('admin.master-point.destroy');

    });
    Route::controller(PrizeController::class)->group(function () {
        Route::get('/prize', 'index')->name('admin.prize.index');
        Route::get('prize/create', 'create')->name('admin.prize.create');
        Route::post('prize', 'store')->name('admin.prize.store');
        Route::get('prize/edit/{prize}', 'edit')->name('admin.prize.edit');
        Route::put('prize/{prize}', 'update')->name('admin.prize.update');
        Route::delete('prize/destroy/{prize}', 'destroy')->name('admin.prize.destroy');
    });
    Route::controller(TransactionPointController::class)->group(function () {
        Route::get('/transaction-point', 'index')->name('admin.transaction-point.index');
        Route::get('transaction-point/create', 'create')->name('admin.transaction-point.create');
        Route::post('transaction-point', 'store')->name('admin.transaction-point.store');
        Route::get('transaction-point/edit/{transactionpoint}', 'edit')->name('admin.transaction-point.edit');
        Route::put('transaction-point/{transactionpoint}', 'update')->name('admin.transaction-point.update');
        Route::delete('transaction-point/destroy/{transactionpoint}', 'destroy')->name('admin.transaction-point.destroy');
        Route::get('/transaction-point/employee-points', 'getEmployeePoints')->name('admin.transaction-point.employee-points');
    });
    Route::controller(ClaimHistoryController::class)->group(function () {
        Route::get('/claim-history', 'index')->name('admin.claim-history.index');
        Route::get('claim-history/create', 'create')->name('admin.claim-history.create');
        Route::post('claim-history', 'store')->name('admin.claim-history.store');
        Route::get('claim-history/edit/{claimhistory}', 'edit')->name('admin.claim-history.edit');
        Route::put('claim-history/{claimhistory}', 'update')->name('admin.claim-history.update');
        Route::delete('claim-history/destroy/{claimhistory}', 'destroy')->name('admin.claim-history.destroy');
        Route::get('/claim-history/employee-points', 'getEmployeeAvailablePoints')->name('admin.claim-history.employee-points');
    });
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
