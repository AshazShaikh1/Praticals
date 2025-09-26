import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

export default function Java(){
  return (
    <div>
      <h2>☕ Java Practicals</h2>
      <p><Link to="/">← Back to Home</Link></p>

      <Accordion title="Practical: Exception Handling (Aim)">
        <p><strong>Aim:</strong> Implement exception handling in Java using try/catch/finally/throws to handle runtime errors.</p>
        <pre><code>{`// Java: Exception handling example
public class ExceptionDemo {
  public static int divide(int a, int b) throws ArithmeticException {
    if (b == 0) throw new ArithmeticException("Divide by zero");
    return a / b;
  }
  public static void main(String[] args) {
    try {
      System.out.println(divide(10, 0));
    } catch (ArithmeticException ex) {
      System.out.println("Caught: " + ex.getMessage());
    } finally {
      System.out.println("Finally block executed.");
    }
  }
}`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Inheritance (Single, Multilevel, Hierarchical)">
        <p><strong>Aim:</strong> Demonstrate Single, Multilevel and Hierarchical inheritance and method overriding (polymorphism).</p>
        <pre><code>{`// Java: Hierarchical inheritance example
class Animal {
  void eat() { System.out.println("Animal eats"); }
  void sleep() { System.out.println("Animal sleeps"); }
}
class Dog extends Animal {
  void sound() { System.out.println("Dog barks"); }
}
class Cat extends Animal {
  void sound() { System.out.println("Cat meows"); }
}
class Test {
  public static void main(String[] args) {
    Animal a = new Dog(); a.eat(); // polymorphism example
  }
}`}</code></pre>
      </Accordion>

      <Accordion title="Practical: OOP Principles (Polymorphism, Abstraction, Interfaces)">
        <p><strong>Aim:</strong> Use abstract classes & interfaces to demonstrate abstraction & polymorphism.</p>
        <pre><code>{`// Java: Interface example
interface Drive {
  void accel();
  void decel();
}
class Car implements Drive {
  private int speed = 0;
  public void accel(){ speed += 10; System.out.println("Speed: " + speed); }
  public void decel(){ speed = Math.max(0, speed - 10); System.out.println("Speed: " + speed); }
}
`}</code></pre>
      </Accordion>

      <Accordion title="Practical: Real-world Car Program (Encapsulation) — Full code transcribed">
        <p><strong>Aim:</strong> Demonstrate encapsulation and basic Java OOP using a car simulation (accel, decel, brake, showspeed).</p>

        <pre><code>{`// Java: Car simulation (transcribed)
package practicalBT1;
import java.util.Scanner;

public class Car {
    private String brand;
    private int speed;

    public Car() {
        this.brand = "BMW";
        this.speed = 0;
    }

    public void accel() {
        if (speed < 200) speed += 10;
        else System.out.println("You are on High speed.");
    }

    public void decel() {
        if (speed > 0) speed -= 10;
        else System.out.println("Car stopped.");
    }

    public void brake() {
        speed = 0;
        System.out.println("You hit the brake!!! Car Stopped");
    }

    public void showspeed() {
        System.out.println("Your car is running " + speed + " Kmph.");
    }

    public void run() {
        Scanner input = new Scanner(System.in);
        System.out.println("Hi Welcome to Brand new BMW car");
        int choice;
        do {
            System.out.println("Please Enter \\n1.Accelerate\\n2.Decelerate\\n3.Brake\\n4.Quit.");
            choice = input.nextInt();
            switch (choice) {
                case 1: accel(); showspeed(); break;
                case 2: decel(); showspeed(); break;
                case 3: brake(); break;
                case 4: System.out.println("You Quit the game"); break;
                default: System.out.println("Wrong Input.");
            }
        } while (choice != 4);
        input.close();
    }

    public static void main(String[] args) {
        Car c1 = new Car();
        c1.run();
    }
}`}</code></pre>
      </Accordion>

      <p style={{marginTop:16}}>— End of Java practicals (extracted/transcribed).</p>
    </div>
  );
}
