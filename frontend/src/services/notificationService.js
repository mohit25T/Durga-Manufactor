/**
 * Web Notification & Audio Sound Service
 * Modeled after local_notification_service.dart
 */

class NotificationService {
  audioCtx = null;

  init() {
    this.requestPermission();
  }

  requestPermission() {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        console.log("🔐 Browser Notification permission:", permission);
      });
    }
  }

  /**
   * Play crystal clear B2B notification chime using Web Audio API
   */
  playChimeSound(isUrgent = false) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }

      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = "sine";

      if (isUrgent) {
        // High alert siren chime
        osc.frequency.setValueAtTime(880, now); // A5
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Soft double-ding chime
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      }
    } catch (e) {
      console.warn("Audio chime play error:", e);
    }
  }

  /**
   * Trigger native browser push banner (works background & foreground)
   */
  showSystemNotification(title, body, onClick = null) {
    this.playChimeSound(title.toLowerCase().includes("rejected") || title.toLowerCase().includes("urgent"));

    if ("Notification" in window && Notification.permission === "granted") {
      try {
        const notif = new Notification(title, {
          body,
          icon: "/logo.png",
          badge: "/favicon-16x16.png",
          tag: "durga-order-notif",
          renotify: true
        });

        if (onClick) {
          notif.onclick = () => {
            window.focus();
            onClick();
            notif.close();
          };
        }
      } catch (err) {
        console.error("System notification error:", err);
      }
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
