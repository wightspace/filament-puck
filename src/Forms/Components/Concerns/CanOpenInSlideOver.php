<?php

namespace Wight\FilamentPuck\Forms\Components\Concerns;

use Closure;
use Filament\Support\Enums\Width;

trait CanOpenInSlideOver
{
    protected bool | Closure $isSlideOver = false;

    protected Width | string | Closure | null $modalWidth = null;

    protected string | Closure | null $openButtonLabel = null;

    protected string | Closure | null $modalHeading = null;

    protected string | Closure | null $modalDescription = null;

    public function slideOver(bool | Closure $condition = true): static
    {
        $this->isSlideOver = $condition;

        return $this;
    }

    public function inline(bool | Closure $condition = true): static
    {
        $this->isSlideOver = fn (): bool => ! $this->evaluate($condition);

        return $this;
    }

    public function isSlideOver(): bool
    {
        return (bool) $this->evaluate($this->isSlideOver);
    }

    public function modalWidth(Width | string | Closure | null $width): static
    {
        $this->modalWidth = $width;

        return $this;
    }

    /**
     * `Width::Screen` is not recommended: Filament disables the slide-over transition for it.
     */
    public function getModalWidth(): Width | string
    {
        return $this->evaluate($this->modalWidth) ?? Width::Full;
    }

    public function openButtonLabel(string | Closure | null $label): static
    {
        $this->openButtonLabel = $label;

        return $this;
    }

    public function getOpenButtonLabel(): string
    {
        return $this->evaluate($this->openButtonLabel) ?? __('filament-puck::puck.actions.open');
    }

    public function modalHeading(string | Closure | null $heading): static
    {
        $this->modalHeading = $heading;

        return $this;
    }

    public function getModalHeading(): string
    {
        return $this->evaluate($this->modalHeading) ?? __('filament-puck::puck.modal.heading');
    }

    public function modalDescription(string | Closure | null $description): static
    {
        $this->modalDescription = $description;

        return $this;
    }

    public function getModalDescription(): ?string
    {
        return $this->evaluate($this->modalDescription);
    }

    public function getModalId(): string
    {
        $key = str_replace(['.', '[', ']'], '-', $this->getName());

        return 'fi-puck-editor-' . $key;
    }

    public function getPuckMountElementId(): string
    {
        return $this->getModalId() . '-canvas';
    }
}
