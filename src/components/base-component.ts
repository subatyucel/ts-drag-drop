export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  newEl: U;

  constructor(
    templateElId: string,
    hostElId: string,
    insertAtStart: boolean,
    newElId?: string
  ) {
    this.templateEl = document.getElementById(
      templateElId
    ) as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElId) as T;
    const importedNode = document.importNode(this.templateEl.content, true);
    this.newEl = importedNode.firstElementChild as U;
    if (newElId) this.newEl.id = newElId;

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtStart === true ? "afterbegin" : "beforeend",
      this.newEl
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}
