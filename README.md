# HealthRisks

This application provides Visualizations of a set health related factors vs. each other, highlighting correlations between Smoking and Poverty and Obsesity in across the various U.S. states.

# Technologies Used

* JavaScript
* D3

# Reference

* GitHub: https://github.com/daddyjab/HealthRisks
* Visualization: https://daddyjab.github.io/HealthRisks

# Contributions

* Jeffery Brown: Designed and implemented all application-specific code and visualations for this application

* Libraries:
    * Tom Alexander Curve Fitting library (for linear regression): https://github.com/Tom-Alexander/regression-js

* Data:
    * Data on precentage of individuals impacted by various health risks per state was provided as input

# Summary

This application provides a visualization of different health risk factors and age as a factor.  It is an interactive visualization using D3 for display of elements of the plots and for event handling:

* Clicking on an axis label changes that axis to represent that factor: Age vs. % Smokers (x-axis) and % Obesity vs. % Poverty (y-axis).
* Hovering over a state displays in a tool tip box the relevant data for the displayed axes for that specific state.  Clicking the state will keep that tool tip persistent on the screen until the mouse moves over a different state.

| Figure 1: Health Risks - Screenshot of Visualization |
|----------|
| ![Health Risks - Screenshot of Visualization is loading...](docs/HealthRisks-visualization.gif "Figure 1: Health Risks - Screenshot of Visualization") |
