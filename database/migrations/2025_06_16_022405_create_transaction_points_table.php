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
        Schema::create('transaction_points', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employe_id');
            $table->date('EntitleDate')->nullable();
            $table->string('PointType')->nullable();
            $table->string('PointDesc')->nullable();
            $table->bigInteger('PointValue')->nullable();
             $table->string('CreatedBy')->nullable();
            $table->string('UpdatedBy')->nullable();
            $table->timestamps();

            $table->foreign('employe_id')->references('id')->on('employes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaction_points');
    }
};
