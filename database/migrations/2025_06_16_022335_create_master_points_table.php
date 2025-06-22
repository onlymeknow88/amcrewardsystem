<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('master_points', function (Blueprint $table) {
            $table->id();
            $table->string('PointDesc')->nullable();
            $table->enum('PointApplyTo',['All','Individual'])->nullable();
            $table->enum('Unit',['Satuan','Bulanan'])->nullable();
            $table->enum('PointType',['plus','minus'])->nullable();
            $table->bigInteger('PointValue')->nullable();
            $table->string('CreatedBy')->nullable();
            $table->string('UpdatedBy')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_points');
    }
};
