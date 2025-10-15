import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private mockNotifications: Notification[] = [
    {
      id: 'notif-1',
      type: 'routine_assigned',
      title: 'Nueva rutina asignada',
      message: 'Tu entrenador te ha asignado una nueva rutina',
      timestamp: new Date().toISOString(),
      read: false,
      icon: 'pi-calendar-plus',
      color: 'primary'
    }
  ];

  constructor() {
    this.notificationsSubject.next(this.mockNotifications);
    this.simulateRealTimeNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.notifications$.pipe(
      map(notifications => notifications.filter(n => !n.read).length)
    );
  }

  markAsRead(id: string): void {
    const notifications = this.notificationsSubject.value;
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notificationsSubject.next([...notifications]);
    }
  }

  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => ({ ...n, read: true }));
    this.notificationsSubject.next(notifications);
  }

  private simulateRealTimeNotifications(): void {
    interval(60000).pipe(
      startWith(0)
    ).subscribe(() => {
      if (Math.random() > 0.7) {
        this.addRandomNotification();
      }
    });
  }

  private addRandomNotification(): void {
    const types = [
      { type: 'comment', title: 'Nuevo comentario', icon: 'pi-comment', color: 'blue' },
      { type: 'achievement', title: 'Logro desbloqueado', icon: 'pi-trophy', color: 'yellow' },
      { type: 'reminder', title: 'Recordatorio', icon: 'pi-clock', color: 'purple' }
    ];

    const random = types[Math.floor(Math.random() * types.length)];
    const newNotif: Notification = {
      id: 'notif-' + Date.now(),
      type: random.type,
      title: random.title,
      message: 'Tienes una nueva notificación',
      timestamp: new Date().toISOString(),
      read: false,
      icon: random.icon,
      color: random.color
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotif, ...current]);
  }
}
