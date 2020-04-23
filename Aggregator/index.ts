import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class Aggregator implements ComponentFramework.StandardControl<IInputs, IOutputs> {


	private _inputValue: string;
	private _symbol: string;
	private _result: any;
	private _container: HTMLDivElement;
	private _inputElement: HTMLInputElement;
	private _notifyOutputChanged: () => void;

	private _context: ComponentFramework.Context<IInputs>;
	private _refreshData: EventListenerOrEventListenerObject;
	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this._context = context;
		this._container = document.createElement("div");
		this._notifyOutputChanged = notifyOutputChanged;

		// Input variables ..
		this._inputElement = document.createElement("input");
		this._inputElement.setAttribute("type", "text");
		this._inputElement.className = "input-aggregator";
		this._inputElement.addEventListener("change", this.onChange.bind(this));

		this._inputValue = context.parameters.inputText.raw ? context.parameters.inputText.raw : '';
		this._symbol = context.parameters.Symbol.raw ? context.parameters.Symbol.raw : '';
		this._result = (this._inputValue === '' || this._inputValue === null
			|| this._inputValue === undefined || this._inputValue === "undefined") ? '' : `${this._inputValue} ${this._symbol}`;
		if (this._inputValue.includes(` ${this._symbol}`)) {
			this._inputElement.setAttribute("value", this._inputValue);
		}
		else {
			this._inputElement.setAttribute("value", this._result);
		}
		// appending the HTML elements to the control's HTML container element.
		this._container.appendChild(this._inputElement);

		container.appendChild(this._container);
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
		this._inputValue = context.parameters.inputText.raw ? context.parameters.inputText.raw : '';
		this._symbol = context.parameters.Symbol.raw ? context.parameters.Symbol.raw : '';
		this._result = (this._inputValue === '' || this._inputValue === null
			|| this._inputValue === undefined || this._inputValue === "undefined") ? '' : `${this._inputValue} ${this._symbol}`;

		if (this._inputValue.includes(` ${this._symbol}`)) {
			this._inputElement.setAttribute("value", this._inputValue);
		}
		else {
			this._inputElement.setAttribute("value", this._result);
		}
	}

	private onChange(event: Event): void {
		let inputText: string = ''
		inputText = this._inputElement.value.toString();
		if (inputText !== null && inputText !== undefined && inputText !== "" && inputText !== 'null') {
			this._inputElement.value = `${inputText} ${this._symbol}`;
		}
		this._notifyOutputChanged();
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		let result: IOutputs = {
			inputText: this._inputElement.value.toString()
		};
		return result;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary

	}
}