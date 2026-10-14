<?php

namespace Wight\FilamentPuck\Forms\Components;

use Filament\Forms\Components\Field;
use Filament\Support\Components\Contracts\HasEmbeddedView;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Js;

class PuckEditor extends Field implements HasEmbeddedView
{
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
        $id = $this->getId();
        $isDisabled = $this->isDisabled();
        $statePath = $this->getStatePath();
        $livewireKey = $this->getLivewireKey();
        $wrapperAttributes = $this->getExtraAttributeBag()
            ->class(['fi-fo-puck-editor']);

        ob_start(); ?>

        <div
            aria-labelledby="<?= e($id) ?>-label"
            id="<?= e($id) ?>"
            role="group"
            x-load
            x-load-src="<?= e(FilamentAsset::getAlpineComponentSrc('puck-editor', 'wight/filament-puck')) ?>"
            x-data="puckEditorFormComponent({
                        isDisabled: <?= Js::from($isDisabled)->toHtml() ?>,
                        stylesheetHref: <?= Js::from(FilamentAsset::getStyleHref('puck-editor', 'wight/filament-puck'))->toHtml() ?>,
                        state: $wire.<?= $this->applyStateBindingModifiers("\$entangle('{$statePath}')", isOptimisticallyLive: false) ?>,
                    })"
            wire:ignore
            wire:key="<?= e($livewireKey) ?>.<?= substr(md5(serialize([$isDisabled])), 0, 64) ?>"
            <?= $wrapperAttributes->toHtml() ?>
        >
            <div x-ref="puck" class="min-h-[32rem] w-full"></div>
        </div>

        <?php $slotHtml = ob_get_clean();

        return $this->wrapEmbeddedHtml(
            $this->wrapInputHtml(
                $slotHtml,
                attributes: $wrapperAttributes,
            ),
            labelTag: 'div',
        );
    }
}
