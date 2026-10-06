<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DashboardRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'from' => $this->from ?: now()->subDays(13)->toDateString(),
            'to' => $this->to ?: now()->toDateString(),
        ]);
    }

    public function rules(): array
    {
        return [
            'from' => 'required|date',
            'to' => 'required|date|after_or_equal:from',
            'asset_id' => 'nullable|exists:assets,id',
        ];
    }

    public function messages(): array
    {
        return [
            'to.after_or_equal' => 'End date should be greater than start date.',
        ];
    }
}
