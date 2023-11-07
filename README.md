# LearnFast (lf)
## Table of contents
1. [General product comments](##general-product-comments)
2. [Description](##description)
3. [Ideas](##ideas)
4. [Resources](##resources): [Code, papers and technical notes](###code,papers-and-technical-notes), [AI Economics and Doom](###ai-economics-and-doom), [General pieces and random stuff](###general-pieces-and-random-stuff) and [Spaced repetition memory systems](###spaced-repetition-memory-systems)
6. [Thoughts](##thoughts): [Human vs Machine](###human-vs-machine), [Marketing strategy](###marketing-strategy)
## General product comments
- **Mission**: Maximises the users ability to operate without a machine.
- Possible reason why other education platforms are not successful is that humans are lazy and learning things (languages, online coding courses) in a self-directed way and through self-motivation is *so rare*. So instead you must focus on the product being for students who are already working towards tests and exams that are imposed on them by the usual educational culture. Exams at schools and unis for example. Or professional exams like CFA. The latter example is technically self-directed, however I think it's different because so many people do it and so "doing a CFA" is more comparable to "going to uni" than "taking Spanish lessons".  

## Description
Repository for the Viva app (from [Viva voce](https://en.wikipedia.org/wiki/Viva_voce)). The broad idea is that a user should be able to log in and learn anything by a combination of conversation, debate and spaced-memory repetition. 

Here is the [Excal sketch file of the app](https://github.com/patrickmziet/viva/blob/main/designs/user_experience.excalidraw).

## Ideas
- Use a LLM to filter data
- Key point from Sutskever and Huang interview: "The most important difference between chatGPT and GPT-4 is that the base on top of which GPT-4 is built predicts the next word with greater accuracy."
- Download Anki card databases for training data.
- Measures of success: Optimize for bits (information) exchanged and retained per second.

## Resources
### Code, papers and technical notes
- GPT4ALL [tweet here](https://twitter.com/LinusEkenstam/status/1640972573910396929?s=20) and [git repo here](https://github.com/nomic-ai/gpt4all). Demo, data and code to train an assistant-style large language model with ~800k GPT-3.5-Turbo Generations based on LLaMa.
- Mayo [GPT4 chatbot with langchain](https://github.com/mayooear/gpt4-pdf-chatbot-langchain)
- Text resource: [tweet here](https://twitter.com/BlancheMinerva/status/1644177571628699649?s=20)
- [CerebrasGPT](https://twitter.com/simonw/status/1641576453740597248?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Lit review](https://kipp.ly/blog/transformer-taxonomy/)
- [Replicated model](https://twitter.com/moyix/status/1641113827411476485?s=20)
- [Databricks finetuning](https://twitter.com/matei_zaharia/status/1639245780136361986?s=20)
- [ConjureAI demo, throwaway UIs](https://youtu.be/xgi1YX6HQBw)
- [Another databricks model](https://twitter.com/goodside/status/1639480267197775872?s=20)
- [Memorizing transformers](https://arxiv.org/abs/2203.08913)
- [Some wild speculation here, but I think it might be possible to train a LLaMA 7B sized model for $85,000 now, and maybe run that model directly in your web browser - with more capabilities than ChatGPT, through hooking up extra tools to it (like Bing)](https://twitter.com/simonw/status/1636756272631681024?s=20)
- ["Our memory-efficient implementation of attention removes the memory bottleneck of self-attention, scaling at least to a sequence length of 1M. At this sequence length the algorithm is multiplying over 1 trillion combinations of queries and keys."](https://twitter.com/abacaj/status/1630678062227488773?s=20) [github link](https://github.com/google-research/google-research/blob/master/memory_efficient_attention/memory_efficient_attention.ipynb)
- [Great thread reviewing a paper about building good language models with little compute:](https://twitter.com/michael_nielsen/status/1619750050216947714?s=20) [Paper](https://arxiv.org/abs/2212.14034)
- ChatGPT for training data [tweet](https://twitter.com/johnjnay/status/1633636103155482624?s=20) [paper](https://arxiv.org/abs/2302.13007)
- [Comprehensive review of transformers](https://arxiv.org/abs/2207.09238)
- [GPT in 60 lines](https://jaykmody.com/blog/gpt-from-scratch/)
- [Example of token compression](https://twitter.com/pwang/status/1643650845437837318?s=20)
- [LLMs in Scientific Research Workflows](https://llminscience.com/)
- Open Assistant chat corpus [tweet](https://twitter.com/vagabondjack/status/1647306411427381248?s=20) and [hugging face](https://huggingface.co/datasets/OpenAssistant/oasst1)
- Andrej Karpathy on storing emeddings using `np.array` [tweet](https://twitter.com/karpathy/status/1647374645316968449?s=20)
- Andrej Karpathy note on k-Nearest Neighbour lookups on embeddings [tweet](https://twitter.com/karpathy/status/1647025230546886658?s=20) and [github link](https://github.com/karpathy/randomfun/blob/master/knn_vs_svm.ipynb)
- [Reflexion substack](https://nanothoughts.substack.com/p/reflecting-on-reflexion) and [paper](https://arxiv.org/abs/2303.11366)
- Scaling Transformer to 1M tokens and beyond with RMT [paper](https://arxiv.org/abs/2304.11062) and [repo](https://github.com/booydar/t5-experiments/tree/scaling-report)
- LAION (“Large-scale AI Open Network”) [bloomberg article](https://www.bloomberg.com/news/features/2023-04-24/a-high-school-teacher-s-free-image-database-powers-ai-unicorns?cmpid=BBD042423_CEU&utm_medium=email&utm_source=newsletter&utm_term=230424&utm_campaign=closeeurope) and [site](https://rom1504.github.io/clip-retrieval/?back=https%3A%2F%2Fknn.laion.ai&index=laion5B-H-14&useMclip=false)  "..he works with a small team of volunteers building the world’s biggest free AI training data set, which has already been used in text-to-image generators such as Google’s Imagen and Stable Diffusion."
- A deep learning model based on object detection for extracting tables from PDFs and images. [github repo](https://github.com/microsoft/table-transformer) from Microsoft.
- [The Dual LLM pattern for building AI assistants that can resist prompt injection by Simon Willison](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/)
- Low-rank adaptation LoRA [tweet](https://twitter.com/rasbt/status/1651226178353614854?s=20) and [lightning AI blog post](https://lightning.ai/pages/community/tutorial/lora-llm/)
- Mayo PDF chatbot [repo](https://github.com/mayooear/gpt4-pdf-chatbot-langchain/tree/feat/chroma) with chroma.
- Nielsen [tweet](https://twitter.com/michael_nielsen/status/1650609755948457987?s=20) on grokking.
- [The little book of Deep Learning](https://fleuret.org/public/lbdl.pdf)
- [Simon W chatgpt plugin prompts](https://github.com/simonw/scrape-chatgpt-plugin-prompts)
- [That's why we've made Whisper **70x faster**](https://twitter.com/sanchitgandhi99/status/1649046650793648128?s=20)
- [Karpathy tweet](https://twitter.com/karpathy/status/1649127655122550784?s=20): "There's a chance that LoRA finetunes work so well that it dramatically alters the finetuning vs. retrieval + few-shot prompting power dynamic in favor of the former for many applications. PEFT (Parameter Efficient Finetuning, LoRA included) are emerging techniques that make it very cheap to finetune LLMs because most of the parameters can be kept frozen and in very low precision during training. The cost of pretraining and finetuning decouple. [https://huggingface.co/blog/peft](https://huggingface.co/blog/peft) +LoRA (the code is very short/readable) [https://github.com/microsoft/LoRA](https://github.com/microsoft/LoRA)"
- [Replit how to train your own LLMs](https://blog.replit.com/llm-training)
- [Alicia Guo UI example where the words you type are what you focus on](https://twitter.com/upcycledwords/status/1648427766151532545?s=20)
- [StableLM](https://github.com/Stability-AI/StableLM/)
- [Another use of chroma when reading pdfs](https://twitter.com/virattt/status/1648463127082844161?s=20)
- [OpenAssistant Dataset](https://huggingface.co/OpenAssistant)
- [auto-evaluate LLM Q+A chains: given inputs docs, app will use an LLM to auto-generate a Q+A eval set, run on a user-selected chain (model, retriever, etc) built w/ @LangChainAI, use an LLM to grade, and store each expt.](https://twitter.com/rlancemartin/status/1647645549875859456?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [NERF](https://twitter.com/yacinemtb/status/1646739970369937408?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [OpenAI release of consistency models](https://twitter.com/_akhaliq/status/1646168119658831874?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [About μP from Igor Babuschkin: "μP allows you to keep the same hyperparameters as you scale up your transformer model. No more hyperparameter tuning at large size! 🪄 It saves millions of $ for very large models."](https://twitter.com/ibab_ml/status/1705423643420119194?s=66&t=ucV6-WK7-aco0DoUmtA6ww)
- [Danish dataset on horses is used because everything else is under copyright](https://www.bloomberg.com/news/newsletters/2023-09-22/danish-ai-trained-on-data-from-a-web-forum-about-horses?cmpid=BBD092223_TECH&utm_medium=email&utm_source=newsletter&utm_term=230922&utm_campaign=tech)
- [Karparthy tweet with YT tutorial on how to make AI-video](https://twitter.com/karpathy/status/1704574172075278754?s=20)
- [Paper on LLM attacks](https://llm-attacks.org/)
- [GH issue for speculative sampling](https://x.com/natfriedman/status/1697283224324751720?s=20)
- [Yacine finetuned GPT-4 beats GPT-4 on some metrics](https://x.com/yacineMTB/status/1695202523496239525?s=20)
- [How is LLaMa.cpp possible? By finabrr](https://finbarr.ca/how-is-llama-cpp-possible/)
- [Llama-2 opensource](https://x.com/ylecun/status/1681336284453781505?s=20)
- [Programming Parallel Computers](https://ppc.cs.aalto.fi/)
- ["instructions on calculating LLM compute and VRAM requirements based on the number of parameters+tokens, precision used, and more"](https://twitter.com/nearcyan/status/1662937711156625408?s=66&t=ucV6-WK7-aco0DoUmtA6ww)
- [Prompting Large Language Models to Plan and Execute Actions Over Long Documents](https://twitter.com/_akhaliq/status/1661641068134436865?s=51)
- [New Talk Pleasure to come by Microsoft BUILD this year and give a talk on "State of GPT". Goes through the GPT Assistant training pipeline, covers some "LLM Psychology", and offers a few best practices:](https://twitter.com/karpathy/status/1661176583317487616?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [LIMA : LLaMA 65B + 1000 supervised samples = {GPT4, Bard} level performance.](https://x.com/ylecun/status/1660632951388880896?s=20)
- [Guidance for controlling large language models](https://twitter.com/itsclivetime/status/1658012014638424067?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- **NB** [Enjoying the growing space of constrained sampling, e.g. according to given context free grammar, forcing LLM output to conform to a template (e.g. json). Apparently Grant doesn't know C++ so GPT-4 wrote it based on psuedocode :D (also reminded of LMQL https://lmql.ai)](https://twitter.com/karpathy/status/1658148644531613698?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Relabeling data using models](https://x.com/yacineMTB/status/1709760111156093201?s=20)
- [Autotune GH repo for updating model every 10 prompts](https://twitter.com/krishnanrohit/status/1653754466607198210?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Get LLMS to produce output according to a schema](https://twitter.com/thesephist/status/1653364144085540864?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Cerebras-GPT: A Family of Open, Compute-efficient, Large Language Models](https://x.com/eladgil/status/1646261730509737987?s=20)
- [Dolly 2.0, a 12B  parameter instruction-following LLM trained exclusively on a free and open dataset generated by Databricks employees and *licensed for commercial use.*](https://twitter.com/vagabondjack/status/1646147422928920576?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Microsoft releases DeepSpeed chat, a framework to fine tune / run multi-node RLHF on models up to 175B parameters. With plans to add LLaMA support $1920 on OPT-66B in just 7.5hrs](https://twitter.com/abacaj/status/1645926065120870405?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [If you're writing prompts, you need to know its accuracy against a test set. You can't just speak to an LLM like a human and expect consistency. Look at the example (left) and try to guess which performs best. All are run zero-shot. The answer is in the second image.](https://twitter.com/mitchellh/status/1645562198935347205?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [Video of the debate:"Do language models need sensory grounding for meaning and understanding?"With @Jake_Browning00, @LakeBrenden, and me on the YES side and Ellie Pavlick, @glupyan, and @davidchalmers42on the NO side. I go through the limitations of Auto-Regressive LLMs.](https://twitter.com/ylecun/status/1644299474418688000?s=51&t=jpKFAV6nxzWabm8-mpfVbQ)
- [The most dramatic optimization to nanoGPT so far (~25% speedup) is to simply increase vocab size from 50257 to 50304 (nearest multiple of 64). This calculates added useless dimensions but goes down a different kernel path with much higher occupancy. Careful with your Powers of 2.](https://twitter.com/karpathy/status/1621578354024677377?s=51&t=LlE38KB95BcazHPPdM7hcA)
- [Teach an LLM to use tools, like a calculator or search engine, in a *self-supervised manner*](https://twitter.com/mathemagic1an/status/1624870248221663232?s=51&t=AW6dEQ03zD0cuA2vUVdmLQ)
- [Train CIFAR10 to 94% in under 10 seconds on a single A100. With a single readable 600-line http://main.py, bunch of nice tricks implemented within.](https://twitter.com/karpathy/status/1620103412686942208?s=66&t=ysr3lSYt0WAw-mwCwBzZdA)
- [laion synthetic dataset](https://x.com/ocolegro/status/1712065511809274116?s=20)
- [Adept multimodal model (non-commercial)](https://twitter.com/AdeptAILabs/status/1714682075763405257?s=20)
- [How to bend GPT4 to do more for you by making emotional appeals](https://x.com/AndrewCurran_/status/1720177766283505724?s=20)
- [64k and 128k context window for Mistral](https://x.com/Teknium1/status/1720108793055596978?s=20)
- [YaRN: Efficient Context Window Extension of Large Language Models](https://twitter.com/nearcyan/status/1720243724901638413?s=20)
- [YouTune: Finetune image models on YouTube videos](https://x.com/charliebholtz/status/1719847667495231700?s=20)
- [Presents CogVLM, a powerful open-source visual language foundation model that achieves SotA perf on 10 classic cross-modal benchmarks](https://x.com/arankomatsuzaki/status/1721719130720530489?s=20)
- [Databricks model training](https://x.com/code_star/status/1721282072147575274?s=20)
- [Shoggoth (silk road for ML models)](https://x.com/thenetrunna/status/1720859919497236825?s=20)
- [TinyLlama: a useful 1B model](https://x.com/Teknium1/status/1720817154747207781?s=20)
- [Emotion Prompting](https://x.com/llama_index/status/1720838162304622617?s=20)
- 


### AI Economics and Doom
- [Michael Nielson Notes on Existential Risk from Artificial Superintelligence](https://michaelnotebook.com/xrisk/index.html)
- [The AI Ate My Homework, and My Schoolwork Too by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-09-18/how-ai-will-change-homework-and-classroom-instruction?utm_medium=email&utm_source=newsletter&utm_term=230918&utm_campaign=author_19834842)
- [Which Countries Will Win the AI Revolution?](https://www.bloomberg.com/opinion/articles/2023-08-10/the-ai-revolution-which-countries-will-win?utm_medium=email&utm_source=newsletter&utm_term=230810&utm_campaign=author_19834842)
- ["how automating the ceremony of writing will change work and society"](https://www.oneusefulthing.org/p/setting-time-on-fire-and-the-temptation?r=ikrq&utm_campaign=post&utm_medium=web)
- ["Thread 🧵on why pretty almost every (!?) AI take is wrong."](https://twitter.com/psychosort/status/1662420591993929732?s=66&t=ucV6-WK7-aco0DoUmtA6ww)
- [Data Science at the Singularity by David Donoho](https://arxiv.org/abs/2310.00865)
- [AI Experts Aren’t Always Right About AI by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-05-06/ai-experts-aren-t-always-right-about-ai?utm_medium=email&utm_source=newsletter&utm_term=230506&utm_campaign=author_19834842)
- [Who Should Be Held Liable for AI’s Harms? by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-04-21/who-should-be-held-liable-for-ai-s-harms?utm_medium=email&utm_source=newsletter&utm_term=230421&utm_campaign=author_19834842)
- [The Taxman Will Eventually Come for AI, Too by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-04-17/the-taxman-will-eventually-come-for-ai-too?utm_medium=email&utm_source=newsletter&utm_term=230417&utm_campaign=author_19834842)
- [The Scaling Hypothesis](https://gwern.net/scaling-hypothesis)
- [Thread about AI Doom](https://twitter.com/WilliamAEden/status/1630690003830599680)
- [20 people who matter in UK tech](https://www.politico.eu/article/power-list-20-people-who-matter-uk-tech-policy-great-britain/)
- [US Higher Education Needs a Revolution. What’s Holding It Back? by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-10-06/us-higher-education-needs-a-revolution-what-s-holding-it-back?utm_medium=email&utm_source=newsletter&utm_term=231006&utm_campaign=author_19834842)
- [How AI Will Remake the Rules of International Trade by Tyler Cowen](https://www.bloomberg.com/opinion/articles/2023-10-11/how-ai-will-remake-the-rules-of-international-trade?utm_medium=email&utm_source=newsletter&utm_term=231011&utm_campaign=author_19834842)
- [Justin Wolfers Webinar: Assigning Homework in a World with ChatGPT](https://youtu.be/m2BvGzms0Ug?si=y-QeYTPmqFUJjCYu)
- [Students Outrunning Faculty in AI Use](https://www.insidehighered.com/news/tech-innovation/artificial-intelligence/2023/10/31/most-students-outrunning-faculty-ai-use?utm_source=Inside+Higher+Ed&utm_campaign=23419446b9-DNU_2021_COPY_02&utm_medium=email&utm_term=0_1fcbc04421-23419446b9-236889242&mc_cid=23419446b9&mc_eid=dae49d931a) 
- [You've been Matrix Multiplied](https://x.com/jamescham/status/1718120386687324248?s=20)

### Spaced repetition systems
- [Michael Nielson Augmenting Long-term Memory](http://augmentingcognition.com/ltm.html)
- [Michael Nielson Using spaced repetition systems to see through a piece of mathematics](https://cognitivemedium.com/srs-mathematics)
- [Gwern Spaced Repetition for Efficient Learning](https://gwern.net/spaced-repetition)
- [Andy Matuschak's list of unusual spaced memory repetition systems](https://x.com/andy_matuschak/status/1278498290296745984?s=20)

### General pieces and random stuff
- [Age of Average (Good words about branding and style)](https://www.alexmurrell.co.uk/articles/the-age-of-average)
- [Malleable software by Geoff Litt](https://www.geoffreylitt.com/2023/03/25/llm-end-user-programming.html)
- [Deepmind jobs](https://twitter.com/egrefen/status/1701592528435511715?s=20)
- [London AI offices](https://x.com/ankesh_anand/status/1695927383386095972?s=20)
- [WTF happened in 1971?](https://wtfhappenedin1971.com/)
- [Britain Is Much Worse Off Than It Understands](https://foreignpolicy.com/2023/02/03/britain-worse-off-1970s/)
- [How to Start a Hard Tech Start Up by Sam Altman](https://www.youtube.com/watch?v=RHSb4G18gFY)
- [In Conversation with Tyler Cowen and Fraser Nelson about England](https://www.youtube.com/watch?v=0jhhsgoEDAE)

### Spaced repetition memory systems
#### [Using Artificial Intelligence to Augment Human Intelligence](https://distill.pub/2017/aia/)
- Idea of attribute vectors.
- Comment on UIs: Common practice for UIs to be designed so that they are easy to use straightaway. For novices, that is. Perhaps you could upgrade the UI as the user improves and desires more functionality. This is an important point.

#### [How can we develop transformative tools for thought?](https://numinous.productions/ttft/)
- "This is the big, counterintuitive advantage of spaced repetition: you get exponential returns for increased effort."
- Good principles of card construction:
    1. **Most questions and answers should be atomic**: Early in his own personal memory practice, one of us was learning the Unix command to create links in the filesystem. He entered the following question into his memory system: “How to create a soft link from linkname to filename”. Together with the corresponding answer “ln -s filename linkname”. This looks like a good question, but he routinely forgot the answer. To address this, he refactored the card into two more atomic cards. One card: “What’s the basic command and option to create a soft link?” (A: “ln -s”). Second card: “When creating a soft link, in what order do linkname and filename go?” (A: “filename linkname”). Breaking the card into more atomic pieces turned a question he routinely got wrong into two questions he routinely got right. It seemed that the more atomic questions brought more sharply into focus what he was forgetting, and so provided a better tool for improving memory. And what of the original card? Initially, he deleted it. But he eventually added the card back, with the same question and answer, since it served to integrate the understanding in the more atomic cards. 
    2. **Make sure the early questions in a mnemonic essay are trivial**: it helps many users realize they aren’t paying enough attention as they read: *Note added December 9, 2019: This claim appears to be based on an error in our data analysis, and is now retracted. We’ve left the text in for historic reasons, but we no longer believe the claim.* This was a discovery made when we released the first Quantum Country essay. Anticipating that users would be struggling with a new interface, we deliberately made the first few questions in the essay utterly trivial – sort of a quantum equivalent to “2+2 = ?” – so they could focus on the interface. To our surprise, users performed poorly on these questions, worse than they did on the (much harder) later questions. Our current hypothesis to explain this is that when users failed to answer the first few questions correctly it served as a wakeup call. The questions were so transparently simple that they realized they hadn’t really been paying attention as they read, and so were subsequently more careful.
    3. **Avoid orphan cards**: These are cards which don’t connect closely to anything else. Suppose, for the sake of illustration, that you’re trying to learn about African geography, and have a question: “What’s the territory in Africa that Morocco disputes?” (A: “The Western Sahara”) If you don’t know anything about the Western Sahara or Morocco or why there’s a dispute, that question will be an orphan, disconnected from everything else. Ideally, you’ll have a densely interconnected web of questions and answers, everything interwoven in striking ways.
- Other interesting points about cards:
    1. Need to avoid users learning surface level features of questions rather than information. For example if there is one "*Who* did ...?" type question users may parrot an answer simply because of the "Who" and actually associate the question information with the answer. One possible solution is to use clozure, i.e. Fill in the gap: "__ and his collaborators..."
    2. How to best help users when they get a question wrong? You can decrease the time interval. But what is probably better is for that specific card to be broken up into further questions. This fits in with the idea of updating flash cards based on user performance and a rubric. Example from essay: Suppose a user can’t remember the answer to the question: “Who was the second President of the United States?” Perhaps they think it’s Thomas Jefferson, and are surprised to learn it’s John Adams. In a typical spaced-repetition memory system this would be dealt with by decreasing the time interval until the question is reviewed again. But it may be more effective to follow up with questions designed to help the user understand some of the surrounding context. E.g.: “Who was George Washington’s Vice President?” (A: “John Adams”). Indeed, there could be a whole series of followup questions, all designed to help better encode the answer to the initial question in memory.
    3. How to encode stories in the mnemonic medium? People often find certain ideas most compelling in story form. Here’s a short, fun example: did you know that Steve Jobs actively opposed the development of the App Store in the early days of the iPhone? It was instead championed by another executive at Apple, Scott Forstall. Such a story carries a force not carried by declarative facts alone. It’s one thing to know in the abstract that even the visionaries behind new technologies often fail to see many of their uses. It’s quite another to hear of Steve Jobs arguing with Scott Forstall against what is today a major use of a technology Jobs is credited with inventing. Can the mnemonic medium be used to help people internalize such stories? To do so would likely violate the principle of atomicity, since good stories are rarely atomic (though this particular example comes close). Nonetheless, the benefits of such stories seem well worth violating atomicity, if they can be encoded in the cards effectively.

- *Elaborative encoding*: Roughly speaking, this is the idea that the richer the associations we have to a concept, the better we will remember it. As a consequence, we can improve our memory by enriching that network of associations.
    1. Provide questions and answers in multiple forms: In 1971, the psychologist Allan Paivio proposed the dual-coding theory, namely, the assertion that verbal and non-verbal information are stored separately in long-term memory. Paivio and others investigated the picture superiority effect, demonstrating that pictures and words together are often recalled substantially better than words alone. This suggests, for instance, that the question “Who was George Washington’s Vice President?” may have a higher recall rate if accompanied by a picture of Washington, or if the answer (John Adams) is accompanied by a picture of Adams. For memory systems the dual-coding theory and picture superiority effect suggest many questions and ideas. How much benefit is there in presenting questions and answer in multiple forms? Perhaps even with multiple pictures, or in audio or video (perhaps with multiple speakers of different genders, different accents, etc), or in computer code? Perhaps in a form that demands some form of interaction? And in each case: what works best?
    2. Vary the context: In 1978, the psychologists Steven Smith, Arthur Glenberg, and Robert BjorkSteven M. Smith, Arthur Glenberg, and Robert A. Bjork, Environmental context and human memory (1978). reported several experiments studying the effect of place on human memory. In one of their experiments, they found that studying material in two different places, instead of twice in the same place, provided a 40% improvement in later recall. This is part of a broader pattern of experiments showing that varying the context of review promotes memory. We can use memory systems to support things like: changing the location of review; changing the time of day of review; changing the background sound, or lack thereof, while reviewing. In each case, experiments have been done suggesting an impact on recall. It’s not necessarily clear how robust the results are, or how reproducible – it’s possible some (or all) are the results of other effects, uncontrolled in the original experiment. Still, it seems worth building systems to test and (if possible) improve on these results.
    3. How do the cards interact with one another? What is the ideal network structure of knowledge? This is a very complicated and somewhat subtle set of questions. Let’s give a simple example to illustrate the idea. We’ve presented the cards in the mnemonic medium as though they are standalone entities. But there are connections between the cards. Suppose you have cards: “Who was George Washington’s Vice President?” (Answer: “John Adams”, with a picture of Adams); “What did John Adams look like?” (Answer: a picture of Adams); perhaps a question involving a sketch of Adams and Washington together at some key moment; and so on. Now, this set of cards forms a network of interrelated cards. And you can use a memory system like Quantum Country to study that network. What happens to people’s observed recall if you remove a card? Are there crucial lynchpin cards? Are there particularly effective network structures? Particularly effective types of relationship between cards? Crucially: are there general principles we can identify about finding the deepest, most powerful ways of representing knowledge in this system?
- Used cards to **build up context on the topic** seems particularly important. "It is hard to compose a French sonnet when you only know 200 words of French". 
- Even the authors note the problem of memorizing things that are not tied to an external goal/requirement. Very few people are curious or driven enough to learn something for the sake of learning it.
- Defensibility in software: As Marc Andreessen has observedIn Elad Gil’s “High Growth Handbook” (2018).: true defensibility purely at the product level is really rare in [Silicon] Valley, because there are a lot of really good engineers… And then there’s the issue of leap-frogging. The next team has the opportunity to learn from what you did and then build something better.
- Another point "There’s a general principle here: good tools for thought arise mostly as a byproduct of doing original work on serious problems. They tend either be created by the people doing that work, or by people working very closely to them, people who are genuinely bought inA related argument has been made in Eric von Hippel’s book “Democratizing Innovation” (2005), which identifies many instances where what appears to be commercial product development is based in large or considerable part on innovations from users.. Furthermore, the problems themselves are typically of intense personal interest to the problem-solvers. They’re not working on the problem for a paycheck; they’re working on it because they desperately want to know the answer."
- Summary at end of essay:
We’ve covered a lot, and it’s helpful to distill the main takeaways – general principles, questions, beliefs, and aspirations. Let’s begin with memory systems, particularly the mnemonic medium:

    1. Memory systems make memory into a choice, rather than an event left up to chance: This changes the relationship to what we’re learning, reduces worry, and frees up attention to focus on other kinds of learning, including conceptual, problem-solving, and creative.
    
    2. Memory systems are in their infancy: it is possible to increase effective human memory by an order of magnitude, even beyond what existing memory systems do; and systems such as the mnemonic medium may help expand the range of subjects users can comprehend at all.
    
    3. What would a virtuoso use of the mnemonic medium look like? There’s some sense in which the mnemonic medium is “just” flash cards. The right conclusion isn’t that it’s therefore trivial; it’s that flash cards are greatly underrated. In writing Quantum Country we treated the writing of the cards with reverence; ideally, authors would take card writing as seriously as Nabokov took sentence writing. Of course, we didn’t reach that level, but the aspiration expands the reach of the medium. What would virtuoso or even canonical uses of the mnemonic medium look like?
    
    4. Memory systems can be used to build genuine conceptual understanding, not just learn facts: In Quantum Country we achieve this in part through the aspiration to virtuoso card writing, and in part through a narrative embedding of spaced repetition that gradually builds context and understanding.
    
    5. Mnemonic techniques such as memory palaces are great, but not versatile enough to build genuine conceptual understanding: Such techniques are very specialized, and emphasize artificial connections, not the inherent connections present in much conceptual knowledge. The mnemonic techniques are, however, useful for bootstrapping knowledge with an ad hoc structure.
    
    6. Memory is far more important than people tend to think: It plays a role in nearly every part of cognition, including problem-solving, creative work, and meta-cognition. The flip side is that memory systems themselves want to grow into other types of tools – tools for reading, tools for problem-solving, tools for creating, tools for attention management. That said, we don’t yet know what memory systems want to be. To reiterate: memory systems are in their infancy.

The mnemonic medium is merely one prototype tool for thought. We also discussed several other ideas, including mnemonic video and executable books. Here are some key takeaways:

    1. What practices would lead to tools for thought as transformative as Hindu-Arabic numerals? And in what ways does modern design practice and tech industry product practice fall short? To be successful, you need an insight-through-making loop to be operating at full throttle, combining the best of deep research culture with the best of Silicon Valley product culture.
    
    2. Tools for thought are (mostly) public goods, and as a result are undersupplied: That said, there are closely-related models of production which have succeeded (the games industry, Adobe, AutoDesk, Pixar). These models should be studied, emulated where possible, and used as inspiration to find more such models.
    
    3. Take emotion seriously: Historically, work on tools for thought has focused principally on cognition; much of the work has been stuck in Spock-space. But it should take emotion as seriously as the best musicians, movie directors, and video game designers. Mnemonic video is a promising vehicle for such explorations, possibly combining both deep emotional connection with the detailed intellectual mastery the mnemonic medium aspires toward.
    
    4. Tools for thought must be developed in tandem with deep, original creative work: Much work on tools for thought focuses on toy problems and toy environments. This is useful when prototyping, but to be successful such tools must ultimately be used to do serious, original creative work. That’s a baseline litmus test for whether the tools are genuinely working, or merely telling a good story. Ideally, for any such tool there will be a stream of canonical media expanding the form, and entering the consciousness of other creators.

Let’s return to the question that began the essay: how to build transformative tools for thought? Of course, we haven’t even precisely defined what such transformative tools are! But they’re the kind of tools where relatively low cost changes in practice produce transformative changes in outcome – non-linear returns and qualitative shifts in thinking. This is in contrast with the usual situation, where a small change in practice causes a small change in results.

Historically, humans have invented many such transformative tools for thought. Writing and music are ancient examples; in modern times, tools such as Photoshop and AutoCAD qualify. Although it’s very early days, we believe the mnemonic medium shows much promise. It needs to be developed much further, along the lines we’ve described, and likely requires additional powerful ideas. But we believe it’s possible for humanity to have a widespread memory practice that radically changes the way we think.

More broadly, we hope the principles in this essay will help support the creation of more transformative tools for thought. Historically, most invention of tools for thought has been done bespoke, by inspired individuals and groups. But we believe that in the future there will be an established community that routinely does this kind of invention.

#### [Gwern Spaced Repetition for Efficient Learning](https://gwern.net/spaced-repetition)

- In the short term, cramming pays off, but it degrades quickly. You can think of spaced repetition as *intervening* on the half-life of your degrading memory where you increase your memory level, it degrades, then you intervene again and so on.
- Review SummaryTo bring it all together with the gist:
                
                  testing is effective and comes with minimal negative factors
                
                
                  expanding spacing is roughly as good as or better than (wide) fixed intervals, but expanding is more convenient and the default
                
                
                  testing (and hence spacing) is best on intellectual, highly factual, verbal domains, but may still work in many low-level domains
                
                
                  the research favors questions which force the user to use their memory as much as possible; in descending order of preference:
                  
                    free recall
                    short answers
                    multiple-choice
                    Cloze deletion
                    recognition
                  
                
                
                  the research literature is comprehensive and most questions have been answered - somewhere.
                
                
                  the most common mistakes with spaced repetition are
                  
                    formulating poor questions and answers
                    assuming it will help you learn, as opposed to maintain and preserve what one already learned54. (It’s hard to learn from cards, but if you have learned something, it’s much easier to then devise a set of flashcards that will test your weak points.)
- Time of review (morning, midday or evening) does not seem to matter.
- "It seems safe to estimate the combined market-share of Anki, Mnemosyne, iSRS and other SRS apps at somewhere under 50,000 users (making due allowance for users who install multiple times, those who install and abandon it, etc.). Relatively few users seem to have migrated from SuperMemo to those newer programs, so it seems fair to simply add that 50k to the other 50k and conclude that the worldwide population is somewhere around (but probably under) 100,000." Wow! **So little**
- !! See [haskell code examples to generate cards](https://gwern.net/spaced-repetition#see-also)

#### [How to Learn and Teach Economics with Large Language Models, Including GPT](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4391863)
- What can GPTs do well?
-- Read, transform and manipulate text
-- Improve writing
-- Improve coding
-- Summarize ideas
-- Answer analytical questions with short causal chains
-- Solve simple models
-- Write exams
-- Generate hypotheses and ideas
- Where is the performance of GPT mixed? Meaning it is useful but caution is in order.
-- Finding data
-- Directing you to sources
-- Summarizing papers and books
- What advice to they give when asking GPTs questions?
1. Surround your question with lots of detail and specific keywords
2. Make your question sound smart, and ask for intelligence and expertise in the answer
3. Ask for answers in the voice of various experts.
4. Ask for compare and contrast.
5. Have it make lists
6. Keep on asking lots of sequential questions on a particular topic.
7. Ask it to summarize doctrines
8. Ask it to vary the mode of presentation
9. Use it to generate new ideas and hypotheses
- " Instead, think of the AI as a “collective unconscious of humanity,” a’ la Carl Jung"
- "By mentioning Friedman you are directing the GPT to look at a more intelligent segment of the potential answer space and this directing will usually get you a better answer than if you just ask “What are the causes of inflation?” Similarly, you want all of the words used in your query to be intelligent-sounding."
- "When introducing third party voices, be careful not to introduce extraneous or distracting information, as that might direct the attention of the GPT to less smart segments of the information space."
- "In contrast, a GPT tutor can quickly guide a student to the right kinds of material for them. Artificial intelligence and the online education system thus represent a return to the Oxford tutorial model which fell out of favor only because of its cost (Cowen and Tabarrok 2014)"
- On asking factual questions:
-- You cannot rely on GPT models for exact answers to data questions. Just don’t do it. And while there are ongoing improvements, it is unlikely that all “random errors” will be eliminated soon.
-- The tool should be matched to the question. If you are asking a search type question use Google or a GPT tied to the internet such as Bing Chat and direct it explicitly to search. There are many GPT and AI tools for researchers, not just general GPTs. Many of these tools will become embedded in workflows. We have heard, for example, that Word, Stata, R, Excel or their successors will all likely start to embed AI tools.
-- GPT models do give “statistically likely” answers to your queries. So most data answers are broadly in the range of the true values. You might thus use GPT for getting a general sense of numbers and magnitudes. For that purpose, it can be much quicker than rooting around with links and documents. Nonetheless beware.
-- GPT models sometimes hallucinate sources.
-- Do not be tricked by the reasonable tone of GPT. People have tells when they lie but GPTs always sound confident and reasonable. Many of our usual “b.s. detectors” won’t be tripped by a false answer from a GPT. This is yet another way in which you need to reprogram your intuitions when dealing with GPTs.
-- The answers to your data queries give some useful information and background context, for moving on to the next step. Keep asking questions.
- Asking to do reasoning step-by-step improves answers.


## Thoughts
### Human vs Machine
- With the increasing ability of AI to automate and do work that a lot of humans do, a question naturally arises: what do you need humans for at all? In the context of homework, the AI can just answer the questions for you. In the knowledge economy, the AI can just audit the books for you.
- More generally you could say that AI will favour situations that are highly structured where procedure dominates, where there are sets of instructions that are to be followed. And humans will have comparative advantage in unstructured settings. Where the rules are unclear, problems are open, complicated and unsolved. This would mean that humans should focus on doing new things, since old things tend to have clear sets of procedures to be followed.
- Then there is a slow creep, it is natural that once new things have been done process starts to arise. And so even if something may not be doable by AI today, it eventually will be.
- What is best for humans in all this? If humans try to compete with AI in procedural tasks they will (1) lose (2) end up being a thoughtless cog in the machine. On the latter point, you could take the thought experiment that if schools only gave homework kids could just mindlessly use AI and coast through school. Humans are not part of this picture.
- Opportunities: (1) Best case is that you find something new, do it, then use AI to automate the procedure. (2) In existing domains, regulatory capture will probably occur and then the question is how you can compete in this domain.

### Marketing strategy
- Get fitness influencers like bodybuilders and College athletes (Swimmers, Soccer players, Tennis, American football, etc) to promote the app. The idea being that they represent your ideal customer, someone who is trying to balance lots of training and school work and they want to get their school work done ASAP. More importantly the perception of your brand will benefit, people who have less time to study are not viewed as lesser when they are athletes. Although they never should be viewed as such.
- Look on YT and TikTok for "Day in the life of a {D1 athlete, Oxford Rower, Harvard, etc}" videos. Perhaps lean towards people who are studying Humanities type work first.
- Try to catch up and coming influencers. If you can see that someone is talented/good and underfollowed then use them.
