# The Story Behind SkillSeed - Google Chrome Built-in AI Challenge 🌟

* Video demo: [Youtube](https://www.youtube.com/watch?v=B0bdoK4BdQg)
* Instruction:[Test steps]()

# 🌟 Inspiration

The idea for **SkillSeed** came from my personal journey of learning and growing as a developer. I often found myself jumping between different technologies—reading documentation, watching tutorials, or experimenting with code. However, it was hard to visualize my progress and see how all my skills interconnected.

I wanted to create a tool that could not only **track my learning activities automatically** but also **visualize the relationships between skills** to provide a sense of achievement and direction. Inspired by the need for a more engaging and rewarding way to track progress, SkillSeed was born.

<div align="center">
    <img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/149/657/datas/original.png" width="100">

</div>



# 🍴What It Does

SkillSeed transforms the way developers approach their learning journey, offering a powerful yet fun way to understand their skills, plan their growth, and celebrate their achievements.

It leverages Chrome's **experimental built-in AI capabilities**, powered by a lightweight LLM **Gmini-Nano** , to analyze the web pages users are browsing. By doing so, it identifies the technologies or skills users are learning about and maps them to their existing knowledge base or creates new milestones.

To make the learning journey more engaging, SkillSeed uses the built-in AI to generate memes tailored to the technical concepts users are exploring.

   ![The implementation and workflow of SkillSeed](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/149/660/datas/original.jpg)

**Beware⚠️!** SkillSeed might even casually **roast** you, saying something like: ***`"Wake up! Your redundant and overlapping web development skills are turning your skill tree into a skill bonsai."`*** 🤭 But honestly, I kind of enjoy watering this little bonsai🎍 growing on my digital screen.

# 🛠️ How I Built SkillSeed
I utilized the **Plasmo** Chrome extension framework for development. I leveraged Chrome's built-in AI capabilities through its **Prompt API** and **Summarizer API** to construct three essential workflows.

1. **Automatic Skill Extraction**:
    SkillSeed analyzes web content, detecting and categorizing key technologies, frameworks, or concepts that the user is currently exploring. 
    I moved all AI workflows from the sidepanel to the background service. Everything happens while users browse technical documentation or watch YouTube videos, so when they open the extension, the relationship graph displays smoothly.
    
2. **Skill Relationship Mapping**:
    Based on the user's historical learning paths, SkillSeed uses **built-in LLM Gemini Nano** to identify relationships between different skills and projects. It then visualizes these connections in an interactive scatter plot ****by **Antv G6**, allowing users to see their personal "skill tree" grow and evolve.
    
3. **Consistent analysis:**
    
    SkillSeed utilizes `IndexDB` for data storage, ensuring both long-term storage of complex node relationships and eliminating the need for third-party database services, making it more suitable for privacy-sensitive scenarios.
    
4. **Meme Generator**:
    
    To add a touch of humor and motivation, SkillSeed uses the built-in AI to generate memes tailored for developers, creating a fun and engaging learning experience.
    
    ![The implementation and workflow of SkillSeed](https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/150/256/datas/original.png)
    

# ⛰️Challenges I ran into

1. **User Privacy:**
    
    The information users browse on websites is highly sensitive privacy data, and securely handling it is a significant challenge. To solve this, all user data is stored in the browser's `IndexDB`, without relying on any third-party data storage solutions. And thanks to Chrome's built-in AI's inherent local private model, all data analysis is performed on users' personal computers without network transmission, ensuring excellent privacy protection. 
    
2. **Token Limit and Focus**:
    
    The 4096-token input limit required careful prompt construction. Passing the entire `document.body.innerText` resulted in unfocused outputs. However, by using `document.title` and `url`, I could effectively extract the webpage's key technical stack, leveraging SEO and web standards for better results.
    
3. **Invalid Model Output**:
    
    The sporadic error:*"Uncaught (in promise) NotSupportedError: The model attempted to output text in an untested language, and was prevented from doing so."* was challenging to handle. By refining prompts to constrain the output format, I managed to reduce occurrences, but a complete fix remains elusive.
    

# 🎉Accomplishments that I'm proud of

I explored SkillSeed for a few days, and each time a green bubble appeared, notifying me of a newly acquired skill or a milestone unlocked, I felt incredibly fulfilled. I became captivated by the side panel's personalized tech bonsai, which mapped out my technical interests and demonstrated how my skills interacted. This visualization significantly influenced how I shaped my career and learning plans.

What stood out the most was how seamlessly everything occurred in the background of my browser. Thanks to its built-in AI capabilities, I could leverage the Gemini LLM to analyze and understand my tech stack better, all without risking my personal browsing data by sharing it with third-party platforms.

I shared SkillSeed with my peers, and when they saw the interconnected nodes of their skills visualized, they remarked that their learning journey finally made sense. The humorous memes also offered a much-needed laugh, lightening the mood for anyone feeling stressed or lost in their studies. It turned the learning experience into something genuinely enjoyable and meaningful.

# 📝What I learned

Building SkillSeed was a rewarding experience that allowed me to combine my love for technology and learning into a practical tool. It taught me to think creatively about how to solve problems and stay focused on delivering value to the end user.

Through SkillSeed, I hope to inspire others to take ownership of their learning journeys and celebrate their progress in a fun, visual way.
<div align="center">
<img src="https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/003/149/665/datas/original.png" height="400"></img>
</div>
While working with Chrome's built-in AI API, I gained numerous insights that sparked my imagination about future AI workflows. When dealing with large-scale LLM tasks, I envision a centralized platform that could distribute tasks to browser endpoints across different devices, leveraging their idle computing power, and then aggregate the results.

This distributed computing approach could revolutionize how we handle AI workloads, making efficient use of untapped computational resources in browsers worldwide. The potential for creating new systems and solutions in this space is incredibly exciting.

The possibilities are endless, and I'm thrilled about the potential to create innovative solutions in this space.

# 🔭What's next for SkillSeed

1. **Enhanced Tech Stack Detection:**
    
    Improve the accuracy of technology skill extraction and mapping through an optimized prompt engine for AI workflows. I plan to implement more efficient methods for extracting crucial information from web pages and potentially integrate NLP-based named entity recognition models to enhance the precision of tech stack identification.
    
2. **Smarter Browsing History Analysis:**
    
    Better utilize browsing data by incorporating temporal information such as page visit duration and intervals between revisits to the same technology stack. This will enable a more comprehensive analysis of users' learning journeys and facilitate the creation of more interactive skill tree visualizations to guide further learning.
    
3. **Community Building and Career Integration:**
    
    Create a platform where users can share their skill trees and learning journeys. SkillSeed could evolve into a unique component of your professional portfolio, offering an engaging and distinctive way to present your technical journey in resumes and professional profiles.
    

---

🚀 **SkillSeed** is more than just a tool—it's a way to bring clarity and joy to your tech journey. Let's keep learning, growing, and achieving together!
