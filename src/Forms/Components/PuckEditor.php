<?php

namespace Wight\FilamentPuck\Forms\Components;

use Filament\Forms\Components\Field;
use Filament\Support\Components\Contracts\HasEmbeddedView;
use Wight\FilamentPuck\Forms\Components\Concerns\CanOpenInSlideOver;

class PuckEditor extends Field implements HasEmbeddedView
{
    use CanOpenInSlideOver;

    protected function setUp(): void
    {
        parent::setUp();

        $this->default([
            'root' => ['props' => []],
            'content' => [],
        ]);
    }

    public function toEmbeddedHtml(): string
    {
        $wrapperAttributes = $this->getExtraAttributeBag()
            ->class(['fi-fo-puck-editor-field']);

        $slotHtml = view('filament-puck::components.puck-editor', [
            'field' => $this,
        ])->render();

        return $this->wrapEmbeddedHtml(
            $this->wrapInputHtml(
                $slotHtml,
                attributes: $wrapperAttributes,
            ),
            labelTag: 'div',
        );
    }
}
