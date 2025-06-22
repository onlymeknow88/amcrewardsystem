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
        Schema::create('claim_histories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('prize_id');
            $table->unsignedBigInteger('transaction_id');
            $table->unsignedBigInteger('employe_id');
            $table->bigInteger('QTY')->nullable();
             $table->string('CreatedBy')->nullable();
            $table->string('UpdatedBy')->nullable();
            $table->timestamps();

            $table->foreign('prize_id')->references('id')->on('prizes')->onDelete('cascade');
            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
            $table->foreign('transaction_id')->references('id')->on('transaction_points')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('claim_histories');
    }
};
