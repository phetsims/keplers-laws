# Kepler's Laws Implementation Notes

The Kepler's Laws PhET Simulation is built on top of the SolarSystemCommon suite, which also supports MySolarSystem. 

`SolarSystemCommonModel` is the foundational model class that runs the model simulation, using
`EllipticalOrbitEngine` for the orbital mechanics calculations.

The main `KeplersLawsModel` keeps track of the current selected Law, the visibility properties, and specific details of each law. For example, division of areas, or the exponent of T and a.

## Memory Management

The majority of the elements in the sim are statically allocated at startup, and exist for the lifetime of the sim, hence most uses of `link`, `addListener`, etc. do NOT need a corresponding `unlink` or `removeListener`.

## EllipticalOrbitNode
To draw the orbit and all its components, the whole structure of shapes is being drawn on top of `EllipticalOrbitNode.ts`. This, along the engine described below, are some of the biggest and most important files in the sim.

## EllipticalOrbitEngine

### Enforcing velocities
Multiple rules are set in the sim that constrain the velocity of the body. For example, when toggling "Always circular" from the UI checkboxes, the velocity will stop being interactive and will be set by default to the exact circular velocity the body would have at that distance.

Similarly, if the velocity magnitude gets close to escape speed, the velocity will be limited from growing anymore. The body's velocity will never reach escape speed because the elliptical calculations wouldn't work anymore. For the same reason, if changing the Sun's mass would cause the current body velocity to become escape, it will be shrunk to the maximum possible value.

### Calculating the orbit
Following the equations described in (1), the series of steps taken to calculate the orbital parameters are as follows:
1. From the "vis viva" equation, we can calculate Semimajor Axis _a_ in terms of _r_ and _v_.
2. Eccentricity _e_ is then obtained from the equation for the specific orbital energy.
3. From the polar ellipse equation, the true anomaly, or _nu_ is calculated. In this step the quadrants are also determined, as well as if the orbit is retrograde. Other angles are calculated such as the argument of periapsis _w_ and the mean anomaly _M_.
4. Using the Third Law, the period _T_ is calculated. and thus, the mean angular velocity _W_. In this step the angular momentum _L_ is also saved.

These steps should give us the necessary parameters to fully determine the unique shape of the ellipse in 2D. They are all within `EllipticalOrbitEngine` with the following names:
1. `calculate_a`
2. `calculate_e` For 1 and 2 the snake case is used to match the equations symbol casing.
3. `calculateAngles`

### Running the orbit
Once the orbital parameters have been calculated, it's time to let the orbit run. Given the mean angular velocity _W_, and the time _t_, we can add up to the mean anomaly _M_. From there, to calculate the true anomaly, we need to numerically solve what's called Kepler's Equation. This is done using the Newton-Raphson method, which is an iterative method that will converge to the solution. The method is implemented in `calculateTrueAnomaly`.

 Then, using the polar ellipse equation, the position of the body can be obtained. From the old position and the new position, the velocity direction can be properly determined, and the magnitude is calculated from the angular momentum, so that it's always preserved.

### Orbital Areas
Similarly to the run step, based on the `periodDivisionProperty`, we can generate a series of time steps that sum the total period. Those time steps are then used to calculate the true anomaly for each division point. And based on the real true anomaly of the body, it is determined if any area has been visited yet, if it currently holds the body, the amount of completion, and other features needed to draw the areas in Second Law. This is done in `calculateOrbitalDivisions`. 


## References
1. https://phys.libretexts.org/Bookshelves/Astronomy__Cosmology/Celestial_Mechanics_(Tatum)/09%3A_The_Two_Body_Problem_in_Two_Dimensions/9.08%3A_Orbital_Elements_and_Velocity_Vector

