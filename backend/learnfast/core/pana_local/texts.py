card_axioms = """
- Flashcards should be atomic, i.e. they focus on a single piece of information.
- Make sure that that some of the flashcards are trivial so that users are able to build up key context on the topic.
- Avoid isolated flashcards which are not connected to other flashcards, that is ensure that the flashcards are connected to each other in such a way that when taken together they build up understanding.
- Do not, under any circumstances, make flashcards containing information which is not found in the provived text.
- The flashcard answers should be less than 8 words long.
"""

more_card_axioms = """
- Flashcards should be atomic, i.e. they focus on a single piece of information.
- Make sure that that some of the flashcards are trivial so that users are able to build up key context on the topic.
- Avoid isolated flashcards which are not connected to other flashcards, that is ensure that the flashcards are connected to each other in such a way that when taken together they build up understanding.
- Do not, under any circumstances, make flashcards containing information which is not found in the provived text.
- The flashcards should be less than 8 words long.
- Take the already produced cards and provide more cards which help users learn this ideas.
"""

card_format = """
- Flash card X:
-- Question: Y
-- Answer: Z

Where X is the number of the flash card, Y is the question and Z is the answer.
"""

json_card_format = """
        { \"X\":{\"Question\":Y, \"Answer\":Z}, ...}

        Where X is the number of the flash card, Y is the question and Z is the answer.
"""

system_message = """
You are a helpful study assistant. I want you to create flashcards to be used for studying. The cards should obey these axioms:

{card_axioms}

and have this format:

{card_format}
"""

json_system_message = """
You are a helpful study assistant. I want you to create flashcards to be used for studying. The cards should obey these axioms:

        {card_axioms}        

        and have this JSON format:

        {json_card_format}

"""

json_nato_flashcards = """
{\"1\":{\"Question\":\"How many members are in the NATO Alliance?\", \"Answer\":\"30\"}, \"2\":{\"Question\":\"What is the name of the Ukrainian President?\", \"Answer\":\"Volodymyr Zelensky\"}, \"3\":{\"Question\":\"Who did the speaker of this speech greet first?\", \"Answer\":\"Madam Speaker\"}, \"4\":{\"Question\":\"Why was, according to the speaker, was NATO created?\", \"Answer\":\"To secure peace in Europe after WW2.\"}, \"5\":{\"Question\":\"Who from Russia is repsonsible for the invasion?\", \"Answer\":\"Vladimir Putin\"}} 
"""

supply_example_text = """

Here is an example text:

"{example_text}"

Make 5 flashcards from this text.
"""

nato_text = """
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

nato_text_short = """
Madam Speaker, Madam Vice President, our First Lady and Second Gentleman. Members of Congress and the Cabinet. Justices of the Supreme Court. My fellow Americans.

Last year COVID-19 kept us apart. This year we are finally together again. 

Tonight, we meet as Democrats Republicans and Independents. But most importantly as Americans.

With a duty to one another to the American people to the Constitution. 

And with an unwavering resolve that freedom will always triumph over tyranny. 

Six days ago, Russia’s Vladimir Putin sought to shake the foundations of the free world thinking he could make it bend to his menacing ways. But he badly miscalculated. 

He thought he could roll into Ukraine and the world would roll over. Instead he met a wall of strength he never imagined.
"""

nato_example_flashcards = """
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
Here is the text I want you to create flashcards from:

"{sample_text}"

Now provide {num_cards} flashcards on the above information. 
"""

ask_for_more = """
Now provide {num_cards} more unique flashcards which breakdown and help the user better the ideas in the following flashcards:

{focus_cards}

with card format:

{card_format}

and card axioms:

{card_axioms}
"""

sample_text = """
The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, that occurred during the period from around 1760 to about 1820–1840. This transition included going from hand production methods to machines; new chemical manufacturing and iron production processes; the increasing use of water power and steam power; the development of machine tools; and the rise of the mechanized factory system. Output greatly increased, and a result was an unprecedented rise in population and in the rate of population growth. The textile industry was the first to use modern production methods, and textiles became the dominant industry in terms of employment, value of output, and capital invested.

The Industrial Revolution began in Great Britain, and many of the technological and architectural innovations were of British origin. By the mid-18th century, Britain was the world's leading commercial nation, controlling a global trading empire with colonies in North America and the Caribbean. Britain had major military and political hegemony on the Indian subcontinent; particularly with the proto-industrialised Mughal Bengal, through the activities of the East India Company. The development of trade and the rise of business were among the major causes of the Industrial Revolution.

The Industrial Revolution marked a major turning point in history. Comparable only to humanity's adoption of agriculture with respect to material advancement, the Industrial Revolution influenced in some way almost every aspect of daily life. In particular, average income and population began to exhibit unprecedented sustained growth. Some economists have said the most important effect of the Industrial Revolution was that the standard of living for the general population in the Western world began to increase consistently for the first time in history, although others have said that it did not begin to meaningfully improve until the late 19th and 20th centuries. GDP per capita was broadly stable before the Industrial Revolution and the emergence of the modern capitalist economy, while the Industrial Revolution began an era of per-capita economic growth in capitalist economies. Economic historians are in agreement that the onset of the Industrial Revolution is the most important event in human history since the domestication of animals and plants.

The precise start and end of the Industrial Revolution is still debated among historians, as is the pace of economic and social changes. Eric Hobsbawm held that the Industrial Revolution began in Britain in the 1780s and was not fully felt until the 1830s or 1840s, while T. S. Ashton held that it occurred roughly between 1760 and 1830. Rapid industrialisation first began in Britain, starting with mechanized textiles spinning in the 1780s, with high rates of growth in steam power and iron production occurring after 1800. Mechanized textile production spread from Great Britain to continental Europe and the United States in the early 19th century, with important centres of textiles, iron and coal emerging in Belgium and the United States and later textiles in France.

An economic recession occurred from the late 1830s to the early 1840s when the adoption of the Industrial Revolution's early innovations, such as mechanized spinning and weaving, slowed and their markets matured. Innovations developed late in the period, such as the increasing adoption of locomotives, steamboats and steamships, and hot blast iron smelting. New technologies such as the electrical telegraph, widely introduced in the 1840s and 1850s, were not powerful enough to drive high rates of growth. Rapid economic growth began to occur after 1870, springing from a new group of innovations in what has been called the Second Industrial Revolution. These innovations included new steel making processes, mass production, assembly lines, electrical grid systems, the large-scale manufacture of machine tools, and the use of increasingly advanced machinery in steam-powered factories.
"""


