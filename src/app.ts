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

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputEl.value);
  }

  private configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
