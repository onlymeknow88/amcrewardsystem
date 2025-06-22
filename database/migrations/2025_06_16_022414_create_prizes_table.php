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
        Schema::create('prizes', function (Blueprint $table) {
            $table->id();
            $table->string('ItemName')->nullable();
            $table->string('ImagePath')->nullable();
            $table->bigInteger('Point')->nullable();
            $table->decimal('Price', 10, 2)->nullable();
            $table->bigInteger('Stock')->nullable();
            $table->date('PeriodStart')->nullable();
            $table->date('PeriodEnd')->nullable();
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
        Schema::dropIfExists('prizes');
    }
};
