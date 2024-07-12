# Styler

An demo of a "style specificity engine"; you add styles with annotative properties to a local store
and retrieve the most appropriate style for a target with a given set of attributes. 

If there are more than one styles that match your attributes perfect ('perfect matches') it returns the 
perfect match with the least specific definition. 

If there are no perfect matches it returns the best match for your attributes; again, ties are broken
by the least specific definition. 