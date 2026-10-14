<?php

use Wight\FilamentPuck\Forms\Components\PuckEditor;

it('registers the puck editor field', function () {
    $field = PuckEditor::make('content');

    expect($field->getName())->toBe('content')
        ->and($field->getDefaultState())->toBe([
            'root' => ['props' => []],
            'content' => [],
        ]);
});
