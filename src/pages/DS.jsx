import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function DS(){
  return (
    <div>
      <h2>📊 Data Structures Practicals</h2>
      <p><Link to="/">← Back to Home</Link></p>

      <Accordion title="Practical: Linear Queue (Aim / Question)">
        <p><strong>Aim:</strong> Implement a linear queue using array with enqueue, dequeue, isEmpty, isFull.</p>
        <pre><code>{`# Python: LinearQueue
class LinearQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = -1
        self.rear = -1

    def isEmpty(self): return self.front == -1
    def isFull(self): return self.rear == self.size - 1

    def enqueue(self, item):
        if self.isFull(): print("Queue Overflow!"); return
        if self.front == -1: self.front = 0
        self.rear += 1
        self.queue[self.rear] = item
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Circular Queue">
        <p><strong>Aim:</strong> Implement circular queue to efficiently use space by wrap-around.</p>
        <pre><code>{`# Python: CircularQueue
class CircularQueue:
    def __init__(self, size):
        self.size = size
        self.queue = [None] * size
        self.front = -1; self.rear = -1

    def isEmpty(self): return self.front == -1
    def isFull(self): return (self.rear + 1) % self.size == self.front
    def enqueue(self, item):
        if self.isFull(): print("Queue Overflow!"); return
        if self.isEmpty(): self.front = self.rear = 0
        else: self.rear = (self.rear + 1) % self.size
        self.queue[self.rear] = item
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Binary Search Tree (BST) — traversals">
        <p><strong>Aim:</strong> Implement BST insert and inorder/preorder/postorder traversals.</p>
        <pre><code>{`# Python: BST (simple)
class Node:
    def __init__(self, key):
        self.key = key; self.left = None; self.right = None

class BST:
    def insert(self, root, key):
        if root is None: return Node(key)
        if key < root.key: root.left = self.insert(root.left, key)
        else: root.right = self.insert(root.right, key)
        return root

    def inorder(self, root, res):
        if root: self.inorder(root.left, res); res.append(root.key); self.inorder(root.right, res)
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Polynomial Linked List — add/subtract">
        <p><strong>Aim:</strong> Represent polynomials with linked lists, implement addition & subtraction.</p>
        <pre><code>{`# Python: Polynomial (linked list)
class Node:
    def __init__(self, coeff, exp):
        self.coeff = coeff; self.exp = exp; self.next = None

class Polynomial:
    def __init__(self): self.head = None
    def add_term(self, coeff, exp):
        # insert in descending exponent order and combine like terms
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Stack — applications (Delimiter match, postfix evaluation)">
        <p><strong>Aim:</strong> Implement a stack; apply to delimiter matching, prefix→postfix and postfix evaluation.</p>
        <pre><code>{`# Python: Stack & postfix eval
class Stack:
    def __init__(self): self.items = []
    def push(self,x): self.items.append(x)
    def pop(self): return self.items.pop() if self.items else None

def evaluate_postfix(expr):
    st = Stack()
    ops = {'+': lambda x,y: x+y, '-': lambda x,y: x-y, '*': lambda x,y: x*y, '/': lambda x,y: x//y}
    for ch in expr:
        if ch.isdigit(): st.push(int(ch))
        else:
            b = st.pop(); a = st.pop()
            st.push(ops[ch](a,b))
    return st.pop()
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Doubly Linked List (Browser history, Undo/Redo demo)">
        <p><strong>Aim:</strong> Implement DLL operations and a simple undo/redo system using DLL.</p>
        <pre><code>{`# Python: Doubly Linked List (representing history)
class Node:
    def __init__(self, data): self.data = data; self.prev=None; self.next=None

class DoublyLinkedList:
    def __init__(self): self.head = None
    def append(self, data):
        # append implementation...
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Hashing — chaining & linear probing">
        <p><strong>Aim:</strong> Implement hash table with chaining and linear probing; show common applications.</p>
        <pre><code>{`# Python: HashTableChaining & HashTableLinear (see DS PDF transcription)
class HashTableChaining:
    def __init__(self,size=7): self.size = size; self.table = [[] for _ in range(size)]
    def _hash(self, key): return hash(key) % self.size
    def insert(self,k,v): self.table[self._hash(k)].append((k,v))
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: AVL Tree & Priority Queue">
        <p><strong>Aim:</strong> Implement AVL insertion rotations and use heapq for priority queue.</p>
        <pre><code>{`# Python: AVL & heapq examples (see DS transcription)
# insert values [10,20,30,40,50,25] into AVL and print preorder
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Graphs — adjacency list/matrix, BFS, DFS, shortest path">
        <p><strong>Aim:</strong> Represent graphs and implement BFS, DFS, and simple shortest path (BFS for unweighted).</p>
        <pre><code>{`# Python: Graph adjacency list & BFS/DFS
from collections import deque

adj_list = {'A':['B','C'], 'B':['A','D'], 'C':['A','D'], 'D':['B','C','E'], 'E':['D']}

def bfs(graph,start):
    visited=set(); q=deque([start])
    while q:
        node=q.popleft()
        if node not in visited:
            print(node, end=' '); visited.add(node)
            for n in graph[node]:
                if n not in visited: q.append(n)
`}</code></pre>
      </Accordion>

      <p style={{marginTop:16}}>— End of DS practicals (extracted). I can split these into separate routes per practical if you prefer.</p>
    </div>
  );
}
