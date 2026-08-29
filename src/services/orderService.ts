import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { WorkflowResult } from '../types';

export interface SavedUserOrder {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  term: string;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  status: 'active' | 'archived' | 'completed';
  result: WorkflowResult;
  userEmail?: string;
}

const ORDERS_COLLECTION = 'user_orders';

// Save or overwrite a workflow result order in Firestore
export async function saveUserOrderToFirestore(
  result: WorkflowResult, 
  userEmail?: string,
  customNotes?: string
): Promise<SavedUserOrder> {
  const orderId = result.id || `order-${Date.now()}`;
  const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);

  const orderData: SavedUserOrder = {
    id: orderId,
    courseCode: result.courseCode || 'Course Plan',
    courseName: result.courseName || 'Academic Roadmap',
    instructor: result.instructor || 'Instructor',
    term: result.term || 'Current Term',
    createdAt: result.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: customNotes || `Generated roadmap with ${result.studyBlocks?.length || 0} study blocks, ${result.ankiCards?.length || 0} Anki cards, and ${result.tasks?.length || 0} tasks.`,
    status: 'active',
    result: result,
    userEmail: userEmail || 'guest@studyhub.ai'
  };

  await setDoc(orderDocRef, {
    ...orderData,
    firestoreUpdatedAt: serverTimestamp()
  });

  return orderData;
}

// Fetch all saved user orders from Firestore
export async function fetchUserOrdersFromFirestore(): Promise<SavedUserOrder[]> {
  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol);
    const querySnapshot = await getDocs(q);
    
    const orders: SavedUserOrder[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data() as SavedUserOrder;
      orders.push({
        ...data,
        id: docSnap.id
      });
    });

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return orders;
  } catch (error) {
    console.warn('Firestore fetch user orders error (falling back to local cache):', error);
    return [];
  }
}

// Delete an order by ID
export async function deleteUserOrderFromFirestore(orderId: string): Promise<boolean> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (error) {
    console.error('Error deleting order from Firestore:', error);
    throw error;
  }
}

// Update specific fields of an order (e.g. courseName, notes, status)
export async function updateUserOrderInFirestore(
  orderId: string, 
  updates: Partial<SavedUserOrder>
): Promise<void> {
  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
      firestoreUpdatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating order in Firestore:', error);
    throw error;
  }
}
