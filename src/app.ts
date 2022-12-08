import { Component, DayType } from './component/component.js';
import { DaysComponent, Days } from './component/days/days.js';
import { PageComponent } from './component/page/page.js';
import { Dialog } from './dialog/dialog.js';
import { Items, Presenter } from './presenter.js';

class App {
  private days: Days & Component;
  private page: PageComponent;
  private daysContainer: HTMLElement;
  private pageContainer: HTMLElement;
  private today: number;
  private presenter: Presenter;
  private items: Items;
  private dialog: Dialog;
  constructor(private appRoot: HTMLElement) {
    this.presenter = new Presenter();
    this.items = this.presenter.getItems();
    this.today = new Date().getDay();
    this.days = new DaysComponent(this.today);
    this.dialog = new Dialog();
    this.daysContainer = this.appRoot.querySelector(
      '.days__container'
    )! as HTMLElement;
    this.days.attatchTo(this.daysContainer);

    this.page = new PageComponent(this.days.getActivedDay()! as DayType);
    this.pageContainer = this.appRoot.querySelector(
      '.contents__container'
    )! as HTMLElement;
    this.page.setOnRemoveItemListener((id, type, day) => {
      this.items = this.presenter.removeItem(id, type, day);
      this.page.updateItems(this.items);
    });
    this.page.setOnStateChangeListener((id, type, day, state) => {
      this.items = this.presenter.updateItem(id, type, day, state);
      this.page.updateItems(this.items);
    });
    this.page.setOnBindDialogListener((type, day) => {
      this.dialog.setType(type);
      this.dialog.attatchTo(document.body);
      this.dialog.setOnCloseListener(() => {
        this.dialog.removeFrom(document.body);
      });

      this.dialog.setOnAddListener(() => {
        this.dialog.removeFrom(document.body);
        this.addItem(
          this.dialog.type,
          this.dialog.time,
          this.dialog.title,
          day! as DayType
        );
      });
    });
    this.page.attatchTo(this.pageContainer);
    this.bindDaysToPage(this.page);

    this.page.updateItems(this.items);

    // weekly => routine만 보여주고 state변경 + filterMenu(visibility hidden)
  }

  private bindDaysToPage(page: PageComponent) {
    const days = document.querySelector('.days')! as HTMLUListElement;
    days.addEventListener('click', (e) => {
      const target = e.target! as HTMLLIElement;
      page.setOnActiveChangeListener(target.dataset.day! as DayType);
    });
  }

  private addItem = (
    type: string,
    time: string,
    title: string,
    day: DayType
  ) => {
    const newItems = this.presenter.addItem(type, time, title, day);
    this.items = newItems;
    this.page.updateItems(this.items);
  };
}

new App(document.querySelector('.document')! as HTMLElement);
