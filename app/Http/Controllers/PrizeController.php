<?php

namespace App\Http\Controllers;

use App\Models\Prize;
use App\Traits\HasFile;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class PrizeController extends Controller
{

    use HasFile;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        $prizes = Prize::query()
            ->select('id', 'ItemName', 'ImagePath', 'Point', 'Price', 'Stock', 'PeriodStart', 'PeriodEnd', 'CreatedBy', 'UpdatedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Admin/Prize/Index', [
            'prizes' => $prizes,
            'page_settings' => [
                'title' => 'Prize',
                'subtitle' => 'Menampilkan semua data Prize'
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'ItemName' => 'required|string|max:255',
            'Point' => 'required|integer|min:0',
            'Price' => 'required|numeric|min:0',
            'Stock' => 'required|integer|min:0',
            'PeriodStart' => 'required|date',
            'PeriodEnd' => 'required|date|after_or_equal:PeriodStart',
            'ImagePath' => 'required|image|mimes:jpeg,png,jpg,gif|max:10240',
        ], [
            'ItemName.required' => 'Prize name is required',
            'Point.required' => 'Points are required',
            'Point.integer' => 'Points must be a number',
            'Point.min' => 'Points must be at least 0',
            'Price.required' => 'Price is required',
            'Price.numeric' => 'Price must be a valid number',
            'Price.min' => 'Price must be at least 0',
            'Stock.required' => 'Stock quantity is required',
            'Stock.integer' => 'Stock must be a number',
            'Stock.min' => 'Stock must be at least 0',
            'PeriodStart.required' => 'Start date is required',
            'PeriodStart.date' => 'Start date must be a valid date',
            'PeriodEnd.required' => 'End date is required',
            'PeriodEnd.date' => 'End date must be a valid date',
            'PeriodEnd.after_or_equal' => 'End date must be after or equal to start date',
            'ImagePath.required' => 'Prize image is required',
            'ImagePath.image' => 'File must be an image',
            'ImagePath.mimes' => 'Image must be jpeg, png, jpg, or gif format',
            'ImagePath.max' => 'Image size must not exceed 10MB',
        ]);

        try {

            $data = [
                'ItemName' => $request->ItemName,
                'Point' => $request->Point,
                'Price' => $request->Price,
                'Stock' => $request->Stock,
                'PeriodStart' => $request->PeriodStart,
                'PeriodEnd' => $request->PeriodEnd,
            ];

            // Handle image upload
            if ($request->hasFile('ImagePath')) {
                $image = $request->file('ImagePath');
                $imageName = time() . '_' . Str::random(10) . '.' . $image->getClientOriginalExtension();
                $imagePath = $image->storeAs('prizes', $imageName, 'public');
                $data['ImagePath'] = $imagePath;
            }

            Prize::create($data);

            return redirect()->back()->with('success', 'Employee created successfully!');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Failed to create prize: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Prize $prize)
    {

        // return $request->hasFile('file');
        // // Validation rules - ImagePath is optional for updates
        $rules = [
            'ItemName' => 'required|string|max:255',
            'Point' => 'required|integer|min:0',
            'Price' => 'required|numeric|min:0',
            'Stock' => 'required|integer|min:0',
            'PeriodStart' => 'required|date',
            'PeriodEnd' => 'required|date|after_or_equal:PeriodStart',
            // 'ImagePath' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240', // nullable for updates
        ];

        $messages = [
            'ItemName.required' => 'Prize name is required',
            'Point.required' => 'Points are required',
            'Point.integer' => 'Points must be a number',
            'Point.min' => 'Points must be at least 0',
            'Price.required' => 'Price is required',
            'Price.numeric' => 'Price must be a valid number',
            'Price.min' => 'Price must be at least 0',
            'Stock.required' => 'Stock quantity is required',
            'Stock.integer' => 'Stock must be a number',
            'Stock.min' => 'Stock must be at least 0',
            'PeriodStart.required' => 'Start date is required',
            'PeriodStart.date' => 'Start date must be a valid date',
            'PeriodEnd.required' => 'End date is required',
            'PeriodEnd.date' => 'End date must be a valid date',
            'PeriodEnd.after_or_equal' => 'End date must be after or equal to start date',
        ];

        $request->validate($rules, $messages);

        // Prepare data for update
        $data = [
            'ItemName' => $request->ItemName,
            'Point' => $request->Point,
            'Price' => $request->Price,
            'Stock' => $request->Stock,
            'PeriodStart' => $request->PeriodStart,
            'PeriodEnd' => $request->PeriodEnd,
            'ImagePath' => $this->update_file($request, $prize, 'ImagePath','prizes'),
        ];


        // Update the prize
        $prize->update($data);

        return to_route('admin.prize.index');

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Prize $prize)
    {
        $this->delete_file($prize, 'ImagePath');
        $prize->delete();

        return to_route('admin.prize.index');
    }
}
