export class TogglePowerMode extends Event {

    static eventName = "toggle-power-mode";

    /**
     * @param {boolean} isOn
     */
    constructor(isOn) {
        super(TogglePowerMode.eventName);
        this.powerModeOn = isOn;
    }
}
