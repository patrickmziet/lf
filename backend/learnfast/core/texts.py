# Prompt templates
card_axioms = """
- Most flash cards should be atomic, i.e. they focus on a single piece of information.
- Make sure that that some of the flash cards are trivial so that users are able to build up key context on the topic.
- Avoid isolated flash cards which are not connected to other flash cards, that is ensure that the flash cards are connected to each other in such a way that when taken together they build up understanding.
- Do not, under any circumstances, make flash cards containing information which is not found in the provived text.
- The flash cards should be less than 8 words long.
"""

card_format = """
- Flash card X:
-- Question: Y
-- Answer: Z

Where X is the number of the flash card, Y is the question and Z is the answer. 
"""

system_message = """
You are a helpful study assistant. I want you to create flash cards to be used for studying. The cards should obey these axioms:

{card_axioms}

and have this format:

{card_format}

where X is the number of the flash card, Y is the question and Z is the answer.
"""

supply_example_text = """

Here is an example text:

"{example_text}"

Make 6 flash cards from this text.
"""

example_text = """
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.  

Last year COVID-19 kept us apart. This year we are finally together again. 

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans. 

With a duty to one another to the American people to the Constitution. 

And with an unwavering resolve that freedom will always triumph over tyranny. 

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. 

He thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined. 

He met the Ukrainian people. 

From President Zelenskyy to every Ukrainian, their fearlessness, their courage, their determination, inspires the world. 

Groups of citizens blocking tanks with their bodies. Everyone from students to retirees teachers turned soldiers defending their homeland. 

In this struggle as President Zelenskyy said in his speech to the European Parliament “Light will win over darkness.” The Ukrainian Ambassador to the United States is here tonight. 

Let each of us here tonight in this Chamber send an unmistakable signal to Ukraine and to the world. 

Please rise if you are able and show that, Yes, we the United States of America stand with the Ukrainian people. 

Throughout our history we’ve learned this lesson when dictators do not pay a price for their aggression they cause more chaos.   

They keep moving.   

And the costs and the threats to America and the world keep rising.   

That’s why the NATO Alliance was created to secure peace and stability in Europe after World War 2. 

The United States is a member along with 29 other nations. 
"""

example_flashcards = """
- Flash card 1:
-- Question: How many members are in the NATO Alliance?
-- Answer: 30
- Flash card 2:
-- Question: What is the name of the Ukrainian President?
-- Answer: Volodymyr Zelenskyy
- Flash card 3:
-- Question: Who did the speaker of this speech greet first?
-- Answer: Madam Speaker
- Flash card 4:
-- Question: Why was, according to the speaker, was NATO created?
-- Answer: To secure peace in Europe after WW2.
- Flash card 5:
-- Question: Who from Russia is repsonsible for the invasion?
-- Answer: Vladimir Putin
- Flash card 6:
-- Question: How many days before the speech did the invasion happen?
-- Answer: 6 days
"""

ask_for_flashcards = """

Here is the text I want you to create flash cards from:

"{sample_text}"

Now provide {num_cards} flash cards on the above information. 

"""

ask_for_more = """
Now provide {num_cards} more unique flash cards with card format:

{card_format}

and card axioms:

{card_axioms}

However, note the score on the already listed flashcards. This is the percentage of times the user has answered the flashcard correctly. Focus on generating flashcards which will help the user better understand topics with lower scores (< 80%).
"""