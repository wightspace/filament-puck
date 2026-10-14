<?php

namespace Wight\FilamentPuck\Forms\Components;

use Closure;
use Filament\Schemas\Components\Section;

class PuckSection
{
    /**
     * @param  array<int, mixed>|Closure  $schema
     */
    public static function make(
        string $statePath = 'body',
        ?string $heading = null,
        ?string $description = null,
        int | Closure | string | null $columnSpan = 2,
    ): Section {
        return Section::make($heading ?? __('filament-puck::puck.section.heading'))
            ->description($description ?? __('filament-puck::puck.section.description'))
            ->collapsible()
            ->columnSpan($columnSpan)
            ->schema([
                PuckEditor::make($statePath)
                    ->slideOver()
                    ->hiddenLabel()
                    ->columnSpanFull(),
            ]);
    }
}
