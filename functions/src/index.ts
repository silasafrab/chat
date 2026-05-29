import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";

admin.initializeApp();

const db = getFirestore("nam5");

export const processScheduledMessages = onSchedule(
  "every 1 minutes",
  async () => {
    const now = admin.firestore.Timestamp.now();

    const snapshot = await db
      .collection("messages")
      .where("status", "==", "scheduled")
      .where("scheduledAt", "<=", now)
      .get();

    if (snapshot.empty) {
      console.log("No scheduled messages to process");
      return;
    }

    const batch = db.batch();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const connectionId = data.connectionId;
      let newStatus = "sent";

      if (connectionId) {
        const connectionDoc = await db.collection("connections").doc(connectionId).get();
        const connection = connectionDoc.data();
        if (!connection || !connection.active) {
          newStatus = "blocked";
        }
      }

      batch.update(doc.ref, { status: newStatus });
    }

    await batch.commit();

    console.log(`Processed ${snapshot.size} scheduled messages`);
  },
);