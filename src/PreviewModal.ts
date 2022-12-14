import {
	ButtonComponent,
	MarkdownView,
	Modal,
	TextAreaComponent,
} from "obsidian";
import GPT3Notes from "main";
import { GPT3ModelParams } from "types";

export class PreviewModal extends Modal {
	constructor(
		private plugin: GPT3Notes,
		private modelParams: GPT3ModelParams,
		private modelResponse: any
	) {
		super(plugin.app);
	}

	onOpen(): void {
		const { contentEl } = this;
		contentEl.setText("Preview GPT-3 Note");

		const container = contentEl.createDiv();
		container.style.border = "1px solid gray";
		container.style.borderRadius = "5px";
		container.style.paddingLeft = "10px";
		container.style.paddingRight = "10px";
		container.style.marginTop = "20px";
		container.style.width = "100%";
		container.style.minHeight = "300px";
		container.style.maxHeight = "600px";
		container.style.overflowY = "scroll";

		const text: string = this.modelResponse.choices[0].text as string;
		const tokens = text.split("\n");
		for (let i = 0; i < tokens.length; i++) {
			container.createEl("p", {
				text: tokens[i],
			});
		}
		const buttonContainer = contentEl.createDiv();
		buttonContainer.style.display = "flex";
		buttonContainer.style.justifyContent = "flex-end";
		buttonContainer.style.gap = "10px";
		buttonContainer.style.marginTop = "15px";

		const cancelButton = new ButtonComponent(buttonContainer);
		cancelButton.buttonEl.style.backgroundColor = "#b33939";
		cancelButton.setButtonText("Cancel").onClick(() => {
			this.close();
		});

		const generateButton = new ButtonComponent(buttonContainer);
		generateButton.buttonEl.style.backgroundColor = "#218c74";
		generateButton.setButtonText("Add to document").onClick(() => {
			const view =
				this.plugin.app.workspace.getActiveViewOfType(MarkdownView);

			if (view) {
				this.close();
				view.editor.replaceSelection(text.slice(2, text.length));
			}
		});
	}

	onClose(): void {}
}
