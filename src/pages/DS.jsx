import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function DS() {
    return (
        <div>
            <h2>📊 Data Structures Practicals</h2>
            <p><Link to="/">← Back to Home</Link></p>

            <Accordion title="Practical2A: Core Linked List Logic (Playlist)">
                <p>Core Linked List Logic Playlist</p>
                <pre><code>{`
# -------------------------------
# PART 1: Core Linked List Logic
# -------------------------------

class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class Playlist:
    def __init__(self):
        self.head = None

    def add_song_to_end(self, song_name):
        new_node = Node(song_name)
        if not self.head:
            self.head = new_node
            return
        temp = self.head
        while temp.next:
            temp = temp.next
        temp.next = new_node

    def add_song_to_start(self, song_name):
        new_node = Node(song_name)
        new_node.next = self.head
        self.head = new_node

    def delete_song(self, song_name):
        if not self.head:
            print("Playlist is empty.")
            return

        if self.head.data == song_name:
            self.head = self.head.next
            return

        temp = self.head
        while temp.next and temp.next.data != song_name:
            temp = temp.next

        if temp.next:
            temp.next = temp.next.next
        else:
            print(f"'{song_name}' not found in playlist.")

    def display_playlist(self):
        temp = self.head
        if not temp:
            print("Playlist is empty.")
            return
        print("Current Playlist:")
        while temp:
            print(f" {temp.data}", end=" -> ")
            temp = temp.next
        print("None")

# -------------------------------
# PART 2: Playlist Simulation
# -------------------------------

my_playlist = Playlist()

my_playlist.add_song_to_end("First Song")
my_playlist.add_song_to_end("Second Song")
my_playlist.add_song_to_start("Third Song")
my_playlist.add_song_to_end("Fourth Song")

print("\n Initial Playlist:")
my_playlist.display_playlist()

my_playlist.delete_song("Second Song")

print("\n After removing 'Second song':")
my_playlist.display_playlist()

my_playlist.add_song_to_start("Fifth Song")
my_playlist.add_song_to_end("Sixth Song")

my_playlist.delete_song("Seventh Song")

print("\n Final Playlist after all operations:")
my_playlist.display_playlist()

                `}</code></pre>
            </Accordion>

            <Accordion title="Practical 3: Core Linked List Logic (Playlist)">
                <p>Node and Polynomial</p>
                <pre><code>{`
# ----------------------------------------
# PART 1: Node and Polynomial Representation
# ----------------------------------------
class Node:
    def __init__(self, coeff, exp):
        self.coeff = coeff
        self.exp = exp
        self.next = None

class Polynomial:
    def __init__(self):
        self.head = None

    def add_term(self, coeff, exp):
        if coeff == 0:
            return
        
        new_node = Node(coeff, exp)

        if not self.head or self.head.exp < exp:
            new_node.next = self.head
            self.head = new_node
            return
        
        if self.head.exp == exp:
            self.head.coeff += coeff
            if self.head.coeff == 0:
                self.head = self.head.next
            return

        temp = self.head
        while temp.next and temp.next.exp > exp:
            temp = temp.next

        if temp.next and temp.next.exp == exp:
            temp.next.coeff += coeff
            if temp.next.coeff == 0:
                temp.next = temp.next.next
            return
        
        new_node.next = temp.next
        temp.next = new_node

    def display(self):
        temp = self.head
        if not temp:
            print("0")
            return
        
        result = ""
        while temp:
            # Handle coefficient of 1 or -1
            coeff_str = ""
            if temp.exp != 0:
                if temp.coeff == 1:
                    coeff_str = ""
                elif temp.coeff == -1:
                    coeff_str = "-"
                else:
                    coeff_str = str(temp.coeff)
            else:
                 coeff_str = str(temp.coeff)
            
            # Handle exponent
            exp_str = ""
            if temp.exp == 1:
                exp_str = "x"
            elif temp.exp > 1:
                exp_str = f"x^{temp.exp}"

            # Handle sign for subsequent terms
            if temp != self.head and temp.coeff >= 0:
                result += " + "
            elif temp != self.head and temp.coeff < 0:
                result += " - "
                if temp.coeff == -1 and temp.exp != 0:
                    coeff_str = ""
                else:
                    coeff_str = str(abs(temp.coeff))
            
            # Print first term sign correctly if negative
            if temp == self.head and temp.coeff < 0:
                 if temp.coeff == -1 and temp.exp != 0:
                    result += "-"
                 else:
                    result += str(temp.coeff)
                 
                 if temp.coeff < 0 and abs(temp.coeff) != 1:
                     coeff_str = str(abs(temp.coeff))
                 elif temp.coeff < 0 and abs(temp.coeff) == 1 and temp.exp == 0:
                      coeff_str = str(temp.coeff)
                 elif temp.coeff < 0 and abs(temp.coeff) == 1 and temp.exp != 0:
                      coeff_str = ""
            
            if temp == self.head and temp.coeff > 0 and temp.coeff != 1:
                 result += str(temp.coeff)

            if temp.coeff != 0:
                result += f"{coeff_str}{exp_str}"
            
            temp = temp.next
        
        print(result)

# ----------------------------------------
# PART 2: Polynomial Addition & Subtraction
# ----------------------------------------
def add_polynomials(poly1, poly2):
    result = Polynomial()
    p1 = poly1.head
    p2 = poly2.head
    
    while p1 or p2:
        if p1 and (not p2 or p1.exp > p2.exp):
            result.add_term(p1.coeff, p1.exp)
            p1 = p1.next
        elif p2 and (not p1 or p2.exp > p1.exp):
            result.add_term(p2.coeff, p2.exp)
            p2 = p2.next
        elif p1 and p2 and p1.exp == p2.exp:
            result.add_term(p1.coeff + p2.coeff, p1.exp)
            p1 = p1.next
            p2 = p2.next
            
    return result

def subtract_polynomials(poly1, poly2):
    neg_poly2 = Polynomial()
    temp_p2 = poly2.head
    while temp_p2:
        neg_poly2.add_term(-temp_p2.coeff, temp_p2.exp)
        temp_p2 = temp_p2.next
    
    return add_polynomials(poly1, neg_poly2)

# Create first polynomial: 4x^3 + 3x^2 + 2
poly1 = Polynomial()
poly1.add_term(4, 3)
poly1.add_term(3, 2)
poly1.add_term(2, 0)
print("\n Polynomial 1:")
poly1.display()

# Create second polynomial: 5x^2 + 1x^1 + 6
poly2 = Polynomial()
poly2.add_term(5, 2)
poly2.add_term(1, 1)
poly2.add_term(6, 0)
print("\n Polynomial 2:")
poly2.display()

# Perform Addition
sum_poly = add_polynomials(poly1, poly2)
print("\n Addition Result:")
sum_poly.display()

# Perform Subtraction
diff_poly = subtract_polynomials(poly1, poly2)
print("\n Subtraction Result (Poly1 - Poly2):")
diff_poly.display()
                `}</code></pre>
            </Accordion>

            <Accordion title="Practical 4B: Undo and Redu">
                <p>DoublyLinkedList</p>
                <pre><code>{`
    class Node:
    def __init__(self, action):
        self.action = action
        self.prev = None
        self.next = None

class UndoRedoSystem:
    def __init__(self):
        self.head = None
        self.current = None

    def perform_action(self, action):
        new_node = Node(action)
        
        if self.head is None:
            # Case 1: Empty history
            self.head = new_node
            self.current = new_node
        else:
            # Case 2: History exists
            
            # Clear redo history (any nodes after current)
            if self.current.next:
                self._clear_redo(self.current)
            
            # Link new node to current action
            new_node.prev = self.current
            self.current.next = new_node
            
            # Advance the current pointer
            self.current = new_node

        print(f"Action performed: '{action}'")

    def _clear_redo(self, node):
        temp = node.next
        while temp:
            next_node = temp.next
            # Explicitly clear references for garbage collection (optional but good practice)
            temp.prev = None
            temp.next = None
            temp = next_node
        node.next = None # This is the essential part

    def undo(self):
        if self.current and self.current.prev:
            self.current = self.current.prev
            print(f"Undo: Now at '{self.current.action}'")
        else:
            print("Cannot undo further.")

    def redo(self):
        if self.current and self.current.next:
            self.current = self.current.next
            print(f"Redo: Now at '{self.current.action}'")
        else:
            print("Cannot redo further.")

    def show_current_action(self):
        if self.current:
            print(f"Current Action: '{self.current.action}'")
        else:
            print("No actions yet.")

    def show_full_history(self):
        print("Full History:")
        temp = self.head
        while temp:
            marker = "<-- current" if temp == self.current else ""
            print(f" {temp.action} {marker}")
            temp = temp.next
        print()

# Instantiate the system
editor = UndoRedoSystem()
print("--- Initial Actions ---")
# Perform some actions
editor.perform_action("Typed 'Hello'")
editor.perform_action("Bolded 'Hello'")
editor.perform_action("Typed 'World'")
editor.show_full_history()

print("--- Undo & Redo ---")
# Undo twice
editor.undo()
editor.undo()
editor.show_current_action()

# Redo once
editor.redo()
editor.show_current_action()

print("--- New Action (Clears Redo History) ---")
# Perform a new action (clears redo history)
editor.perform_action("Italicized 'World'")
editor.show_full_history()

print("--- Final Check ---")
# Try undo/redo again
editor.undo()
editor.redo()
                `}</code></pre>
            </Accordion>
            
            <Accordion title="Practical 4C: FORWARD AND BACKWARD TRAVERSAL">
                <p>DoublyLinkedList</p>
                <pre><code>{`# Node class for the doubly linked list
class Node:
    def __init__(self, data):
        self.data = data # Value of the node
        self.prev = None # Pointer to the previous node
        self.next = None # Pointer to the next node

# Doubly Linked List class
class DoublyLinkedList:
    def __init__(self):
        self.head = None # Start of the list

    # Insert at the end of the list
    def append(self, data):
        new_node = Node(data)
        if self.head is None:
            self.head = new_node
            return
        
        # Traverse to the last node
        current = self.head
        while current.next:
            current = current.next
            
        # Adjust pointers
        current.next = new_node
        new_node.prev = current

    # Traverse forward
    def traverse_forward(self):
        current = self.head
        print("Forward Traversal:")
        while current:
            print(current.data, end=" <-> ")
            current = current.next
        print("None") # End marker

    # Traverse backward
    def traverse_backward(self):
        current = self.head
        if current is None:
            print("Backward Traversal:\nNone")
            return
        
        # Go to the last node
        while current.next:
            current = current.next
            
        print("Backward Traversal:")
        while current:
            print(current.data, end=" <-> ")
            current = current.prev
        print("None") # End marker

# Example usage
if __name__ == "__main__":
    dll = DoublyLinkedList()
    dll.append(10)
    dll.append(20)
    dll.append(30)
    dll.append(40)
    dll.traverse_forward()
    dll.traverse_backward()
    `}</code></pre>
            </Accordion>

            <Accordion title="Practical 5: Postfix and Prefix">
                <p>Postfix and Prefix</p>
                <pre><code>{`class Stack:
    def __init__(self):
        self.items = []

    def is_empty(self):
        return len(self.items) == 0

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()
        return None

    def peek(self):
        if not self.is_empty():
            return self.items[-1]
        return None

    def size(self):
        return len(self.items)

# 1. Delimiter Matching (Balanced Parentheses)
def is_balanced(expression):
    stack = Stack()
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in expression:
        if ch in "([{":
            stack.push(ch)
        elif ch in ")]}":
            if stack.is_empty() or stack.pop() != pairs[ch]:
                return False
    return stack.is_empty()

# 2. Undo Mechanism Example
def undo_demo(actions):
    stack = Stack()
    for act in actions:
        if act != "UNDO":
            stack.push(act)
            print(f"Action performed: {act}")
        else:
            undone = stack.pop()
            if undone is not None:
                print(f"Undo action: {undone}")
            else:
                print("Cannot undo further.")

# 3. Prefix to Postfix Conversion
def prefix_to_postfix(expression):
    stack = Stack()
    operators = set(['+', '-', '*', '/', '^'])
    # Process in reverse order
    for ch in expression[::-1]:
        if ch not in operators:
            stack.push(ch)
        else:
            # Op1 is popped first, Op2 is popped second
            op1 = stack.pop()
            op2 = stack.pop()
            
            if op1 is None or op2 is None: # Safety check for invalid expression
                return "Error: Invalid prefix expression" 
                
            stack.push(op1 + op2 + ch) # Structure: (Op1 Op2 Operator)
            
    final_result = stack.pop()
    return final_result if stack.is_empty() else "Error: Invalid prefix expression"

# 4. Postfix Evaluation
def evaluate_postfix(expression):
    stack = Stack()
    operators = {'+': lambda x, y: x + y,
                 '-': lambda x, y: x - y, # a - b
                 '*': lambda x, y: x * y,
                 '/': lambda x, y: x / y} # a / b
                 
    for ch in expression:
        if ch.isdigit():
            stack.push(int(ch))
        elif ch in operators:
            # b is popped first, a is popped second
            b = stack.pop()
            a = stack.pop()
            
            if a is None or b is None: # Safety check for invalid expression
                 return "Error: Invalid postfix expression"
                 
            # Evaluation is performed as a OP b
            stack.push(operators[ch](a, b))
            
    final_result = stack.pop()
    return final_result if stack.is_empty() else "Error: Invalid postfix expression"

# ------------------- TESTING -------------------
# 1. Delimiter Matching
print("1. Delimiter Matching")
print("Balanced check '({[]})':", is_balanced("({[]})"))
print("Balanced check '([)]':", is_balanced("([)]"))

# 2. Undo Mechanism
print("\n2. Undo Demo:")
undo_demo(["Type A", "Type B", "UNDO", "Type C", "UNDO"])

# 3. Prefix to Postfix
prefix = "*+23-45"
postfix = prefix_to_postfix(prefix)
print("\n3. Prefix to Postfix")
print("Prefix:", prefix, "→ Postfix:", postfix)

# 4. Evaluate Postfix
print("\n4. Evaluate Postfix")
# Correct evaluation of *+23-45 which converts to 32+45-*
# (3+2) * (4-5) = 5 * (-1) = -5
print(f"Evaluate Postfix ({postfix}):", evaluate_postfix(postfix))`}</code></pre>
            </Accordion>

            

            <p style={{ marginTop: 16 }}>— End of DS practicals (extracted). I can split these into separate routes per practical if you prefer.</p>
        </div>
    );
}
