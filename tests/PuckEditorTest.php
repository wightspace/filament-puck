<?php

use Wight\FilamentPuck\Forms\Components\PuckEditor;
use Wight\FilamentPuck\Forms\Components\PuckSection;

it('registers the puck editor field', function () {
    $field = PuckEditor::make('content');

    expect($field->getName())->toBe('content')
        ->and($field->getDefaultState())->toBe([
            'root' => ['props' => []],
            'content' => [],
        ])
        ->and($field->isSlideOver())->toBeFalse();
});

it('can open the editor in a slide over', function () {
    $field = PuckEditor::make('content')->slideOver();

    expect($field->isSlideOver())->toBeTrue()
        ->and($field->getModalId())->toBe('fi-puck-editor-content');
});

it('provides a puck section helper', function () {
    $section = PuckSection::make();

    expect($section)->toBeInstanceOf(\Filament\Schemas\Components\Section::class);
});
