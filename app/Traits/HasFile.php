<?php

namespace App\Traits;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

trait HasFile
{
    public function upload_file(Request $request, string $column, string $folder): ?string
    {
         $imageName = time() . '_' . Str::random(10) . '.' . $request->file('file')->getClientOriginalExtension();
        return $request->hasFile($column) ? $request->file($column)->storeAs($folder, $imageName, 'public') : null;
    }

    public function update_file(Request $request, Model $model, string $column, string $folder): ?string
    {
        if ($request->hasFile('file')) {
            $imageName = time() . '_' . Str::random(10) . '.' . $request->file('file')->getClientOriginalExtension();
            if ($model->$column) {
                Storage::disk('public')->delete($model->$column);
            }
            $thumbnail = $request->file('file')->storeAs($folder, $imageName, 'public');
        } else {
            $thumbnail = $model->$column;
        }


        return $thumbnail;
    }

    public function delete_file(Model $model, string $column): void
    {
        if ($model->$column) {
            Storage::disk('public')->delete($model->$column);
        }
    }
}
