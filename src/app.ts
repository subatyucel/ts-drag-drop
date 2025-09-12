interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable) {
  let isValid = true;
  const { value, required, minLength, maxLength, min, max } = validatableInput;

  if (required) isValid = isValid && value.toString().trim().length !== 0;

  if (minLength != null && typeof value === "string")
    isValid = isValid && value.length >= minLength;

  if (maxLength != null && typeof value === "string")
    isValid = isValid && value.length <= maxLength;

  if (min != null && typeof value === "number")
    isValid = isValid && value >= min;

  if (max != null && typeof value === "number")
    isValid = isValid && value <= max;

  return isValid;
}

function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  return adjDescriptor;
}

class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateEl = document.getElementById(
      "project-list"
    ) as HTMLTemplateElement;

    this.hostEl = document.getElementById("app") as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLElement;
    this.element.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.element);
  }
}

class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  element: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.getElementById(
      "project-input"
    ) as HTMLTemplateElement;

    this.hostEl = document.getElementById("app") as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);

    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = "user-input";

    this.titleInputEl = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;

    this.descriptionInputEl = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;

    this.peopleInputEl = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;

    this.configure();
    this.attach();
  }

  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descValidatable) ||
      !validate(peopleValidatable)
    ) {
      alert("Invalid Input Please Try Again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;

      console.log("Title: ", title);
      console.log("Description: ", desc);
      console.log("People: ", people);
      this.clearInputs();
    }
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList("active");
const finishedPrjList = new ProjectList("finished");
