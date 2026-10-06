<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DayOverviewRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'date' => $this->date ?: now()->toDateString(),
        ]);
    }

    public function rules(): array
    {
        return [
            'date' => 'required|date',
            'asset_id' => 'nullable|exists:assets,id',
        ];
    }
}
