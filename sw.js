const APP_SHELL = '/trainer-pro/';

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
    let payload = {};
    try {
        payload = event.data ? event.data.json() : {};
    } catch {
        payload = { title: 'Zen Wellness Club', body: event.data?.text() || 'Yeni seans hatırlatması.' };
    }
    event.waitUntil(self.registration.showNotification(payload.title || 'Zen Wellness Club', {
        body: payload.body || 'Yaklaşan seansınız var.',
        icon: `${APP_SHELL}zen-wellness-icon.png`,
        badge: `${APP_SHELL}zen-wellness-icon.png`,
        tag: payload.tag || 'trainer-pro-schedule',
        data: { url: payload.url || APP_SHELL }
    }));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const targetUrl = new URL(event.notification.data?.url || APP_SHELL, self.location.origin).href;
    event.waitUntil((async () => {
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const existing = clients.find(client => 'focus' in client);
        if (existing) {
            await existing.focus();
            return existing.navigate(targetUrl);
        }
        return self.clients.openWindow(targetUrl);
    })());
});
