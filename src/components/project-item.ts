import { Draggable } from "../models/drag-drop.js";
import { Project } from "../models/project.js";
import { Component } from "./base-component.js";
import { autobind } from "../decorators/autobind.js";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? "1 person"
      : `${this.project.people} persons`;
  }

  constructor(hostElId: string, project: Project) {
    super("single-project", hostElId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  @autobind
  dragEndHandler(_: DragEvent) {}

  configure() {
    this.newEl.addEventListener("dragstart", this.dragStartHandler);
    this.newEl.addEventListener("dragend", this.dragEndHandler);
  }
  renderContent() {
    this.newEl.querySelector("h2")!.textContent = this.project.title;
    this.newEl.querySelector("h3")!.textContent = `${this.persons} assigned.`;
    this.newEl.querySelector("p")!.textContent = this.project.description;
  }
}
