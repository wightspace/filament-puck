@php
    use Filament\Support\Facades\FilamentAsset;
    use Illuminate\Support\Js;

    $id = $field->getId();
    $isDisabled = $field->isDisabled();
    $statePath = $field->getStatePath();
    $livewireKey = $field->getLivewireKey();
    $modalId = $field->getModalId();
    $puckMountElementId = $field->getPuckMountElementId();
    $isSlideOver = $field->isSlideOver();
    $openButtonLabel = $field->getOpenButtonLabel();
    $modalHeading = $field->getModalHeading();
    $modalDescription = $field->getModalDescription();
    $closeModalAlpineClickHandler = '$dispatch(' . Js::from('close-modal') . ', { id: ' . Js::from($modalId) . ' })';
@endphp

<div
    aria-labelledby="{{ $id }}-label"
    id="{{ $id }}"
    role="group"
    wire:ignore
    x-load
    x-load-src="{{ FilamentAsset::getAlpineComponentSrc('puck-editor', 'wightspace/filament-puck') }}"
    x-data="puckEditorFormComponent({
                displayMode: @js($isSlideOver ? 'slideOver' : 'inline'),
                modalId: @js($modalId),
                mountElementId: @js($puckMountElementId),
                isDisabled: @js($isDisabled),
                stylesheetHref: @js(FilamentAsset::getStyleHref('puck-editor', 'wightspace/filament-puck')),
                state: $wire.{{ $field->applyStateBindingModifiers("\$entangle('{$statePath}')", isOptimisticallyLive: false) }},
            })"
    wire:key="{{ $livewireKey }}.{{ substr(md5(serialize([$isDisabled, $isSlideOver])), 0, 64) }}"
    {{ $field->getExtraAttributeBag()->class(['fi-fo-puck-editor']) }}
>
    @if ($isSlideOver)
        <div class="fi-puck-editor-launcher">
            <div>
                <p class="fi-puck-editor-launcher-title">
                    {{ __('filament-puck::puck.launcher.title') }}
                </p>
                <p class="fi-puck-editor-launcher-summary" x-text="summaryText"></p>
            </div>

            <x-filament::button
                type="button"
                color="gray"
                size="sm"
                :disabled="$isDisabled"
                x-on:click="openBuilder()"
                class="fi-ac-btn-action"
            >
                {{ $openButtonLabel }}
            </x-filament::button>
        </div>

        <x-filament::modal
            :heading="$modalHeading"
            :description="filled($modalDescription) ? $modalDescription : null"
            :id="$modalId"
            slide-over
            :width="$field->getModalWidth()"
            teleport="body"
            :close-by-clicking-away="false"
            sticky-header
        >
            <div
                id="{{ $puckMountElementId }}"
                class="fi-puck-editor-canvas fi-puck-editor-canvas-slide-over"
            ></div>

            <x-slot name="footer">
                <div class="flex w-full justify-end gap-3">
                    <x-filament::button
                        type="button"
                        color="gray"
                        size="sm"
                        x-on:click="{!! $closeModalAlpineClickHandler !!}"
                    >
                        {{ __('filament-puck::puck.actions.done') }}
                    </x-filament::button>
                </div>
            </x-slot>
        </x-filament::modal>
    @else
        <div id="{{ $puckMountElementId }}" class="fi-puck-editor-canvas fi-puck-editor-canvas-inline"></div>
    @endif
</div>
