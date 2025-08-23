import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface ISuccessActions {
    onClick: () => void;
}

export class FormSuccess extends Component<any> {
    protected _closeButton: HTMLButtonElement;
    protected totalContainer: HTMLElement;
    
    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);
        this.totalContainer = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._closeButton.addEventListener('click', actions.onClick);
        }
    }

    show(total: number) {
        this.setText(this.totalContainer, `Списано ${total} синапсов`);
    }
}