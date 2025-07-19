import { ExecArgs, IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

export default async function seedHumilityDB({ container }: ExecArgs) {
  const productService: IProductModuleService = container.resolve(Modules.PRODUCT)

  console.log("🌱 Seeding Humility DB content...")

  // Create main categories
  const categories = [
    // Content Categories
    {
      name: "Technique Library",
      handle: "technique-library",
      description: "BJJ techniques and instructional content",
      metadata: {
        content_type: "technique",
        icon: "▶",
        color_gradient: "from-cyan-400 to-blue-500"
      }
    },
    {
      name: "Guard Techniques",
      handle: "guard-techniques", 
      description: "Guard-related techniques and concepts",
      metadata: {
        content_type: "technique",
        icon: "◯",
        color_gradient: "from-purple-500 to-pink-500"
      }
    },
    {
      name: "Passing Techniques",
      handle: "passing-techniques",
      description: "Guard passing fundamentals and advanced concepts",
      metadata: {
        content_type: "technique", 
        icon: "→",
        color_gradient: "from-orange-400 to-red-500"
      }
    },
    {
      name: "Submissions",
      handle: "submissions",
      description: "Submission techniques and setups",
      metadata: {
        content_type: "technique",
        icon: "⚡",
        color_gradient: "from-green-400 to-teal-500"
      }
    },
    {
      name: "Flow Sessions",
      handle: "flow-sessions",
      description: "Flow state and presence training",
      metadata: {
        content_type: "flow",
        icon: "∞",
        color_gradient: "from-cyan-400 to-purple-500"
      }
    },
    {
      name: "Mindset Modules",
      handle: "mindset-modules",
      description: "Warrior mindset and philosophy",
      metadata: {
        content_type: "mindset",
        icon: "◊",
        color_gradient: "from-yellow-400 to-orange-500"
      }
    },
    
    // E-commerce Categories
    {
      name: "Apparel",
      handle: "apparel",
      description: "BJJ gis, rashguards, and training apparel",
      metadata: {
        content_type: "merchandise",
        icon: "👕",
        color_gradient: "from-gray-400 to-gray-600"
      }
    },
    {
      name: "Training Equipment",
      handle: "training-equipment",
      description: "Mats, dummies, and training accessories",
      metadata: {
        content_type: "merchandise",
        icon: "🥋",
        color_gradient: "from-blue-400 to-indigo-500"
      }
    }
  ]

  // Create categories
  const createdCategories = {}
  for (const category of categories) {
    try {
      const created = await productService.createProductCategories(category)
      createdCategories[category.handle] = created
      console.log(`✅ Created category: ${category.name}`)
    } catch (error) {
      console.log(`⚠️ Category ${category.name} might already exist`)
    }
  }

  // Sample technique content as products
  const sampleTechniques = [
    {
      title: "Guard Retention Flow",
      handle: "guard-retention-flow",
      description: "Master the fundamentals of maintaining guard position through fluid hip movement and gripping strategies. This sequence teaches you how to stay one step ahead of your opponent's passing attempts.",
      status: "published",
      metadata: {
        content_type: "technique",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_id: "dQw4w9WgXcQ",
        difficulty_level: "intermediate",
        duration_minutes: 15,
        instructor_notes: "Focus on hip movement and timing rather than strength. The key is to create frames and angles that make passing difficult.",
        key_points: [
          "Hip escape mechanics",
          "Grip fighting principles", 
          "Counter-attack opportunities",
          "Timing and rhythm"
        ],
        prerequisites: ["Basic guard position", "Hip escape fundamentals"],
        next_techniques: ["Triangle setup from guard", "Sweep options"]
      }
    },
    {
      title: "Triangle Choke Setup",
      handle: "triangle-choke-setup",
      description: "Learn the fundamental triangle choke from closed guard, focusing on proper angle creation and hip movement for maximum efficiency.",
      type: "digital_content", 
      status: "published",
      metadata: {
        content_type: "technique",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_id: "dQw4w9WgXcQ", 
        difficulty_level: "intermediate",
        duration_minutes: 12,
        instructor_notes: "The triangle is about angle and leverage, not strength. Create the angle first, then apply pressure.",
        key_points: [
          "Arm isolation techniques",
          "Hip angle creation",
          "Leg positioning",
          "Finishing mechanics"
        ],
        prerequisites: ["Closed guard control", "Basic hip movement"],
        next_techniques: ["Triangle variations", "Armbar from triangle"]
      }
    },
    {
      title: "Knee Cut Pass Defense",
      handle: "knee-cut-pass-defense",
      description: "Comprehensive defense against one of the most common guard passes. Learn to create frames, recover guard, and counter-attack.",
      status: "published", 
      metadata: {
        content_type: "technique",
        youtube_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        youtube_id: "dQw4w9WgXcQ",
        difficulty_level: "beginner",
        duration_minutes: 10,
        instructor_notes: "Early recognition is key. Don't let the pass develop - address it immediately.",
        key_points: [
          "Frame creation",
          "Hip escape timing",
          "Underhook recovery",
          "Counter-attack options"
        ],
        prerequisites: ["Basic guard position", "Framing concepts"],
        next_techniques: ["Advanced guard recovery", "Sweep counters"]
      }
    }
  ]

  // Sample flow sessions
  const sampleFlowSessions = [
    {
      title: "Breath & Movement Integration",
      handle: "breath-movement-integration",
      description: "Connect your breath to movement, creating a foundation for sustained presence. This session teaches you how to use breathing as an anchor for awareness during intense training.",
      status: "published",
      metadata: {
        content_type: "flow",
        session_type: "guided",
        duration_minutes: 10,
        difficulty_level: "all_levels",
        audio_url: "https://example.com/breath-movement.mp3",
        instructions: "Find a comfortable position, close your eyes, and follow the guided breathing patterns while moving through basic positions.",
        key_concepts: [
          "Box breathing technique",
          "Movement synchronization", 
          "Pressure point awareness",
          "Present moment anchoring"
        ]
      }
    },
    {
      title: "Competition Pressure Flow",
      handle: "competition-pressure-flow",
      description: "Advanced flow state training for high-pressure situations. Learn to maintain presence and clarity when the stakes are highest.",
      status: "published",
      metadata: {
        content_type: "flow",
        session_type: "advanced",
        duration_minutes: 15,
        difficulty_level: "advanced",
        audio_url: "https://example.com/competition-pressure.mp3",
        instructions: "This session simulates high-pressure scenarios. Use visualization and breathing to maintain flow state under stress.",
        key_concepts: [
          "Pressure adaptation",
          "Stress response control",
          "Competitive mindset",
          "Flow under pressure"
        ]
      }
    }
  ]

  // Sample mindset modules
  const sampleMindsetModules = [
    {
      title: "The Warrior's Code",
      handle: "warriors-code",
      description: "Ancient principles for modern warriors. Explore timeless wisdom that transforms how you approach training and life.",
      status: "published",
      metadata: {
        content_type: "mindset",
        module_type: "philosophy",
        duration_minutes: 25,
        difficulty_level: "beginner",
        content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        key_concepts: [
          "Honor and integrity",
          "Discipline as freedom",
          "Respect for opponents",
          "Continuous improvement"
        ],
        learning_objectives: [
          "Understand warrior principles",
          "Apply honor in training",
          "Develop disciplined mindset",
          "Cultivate respect"
        ]
      }
    },
    {
      title: "Ego as Teacher",
      handle: "ego-as-teacher",
      description: "Transform your ego from obstacle to ally. Learn to use resistance and frustration as fuel for growth.",
      status: "published",
      metadata: {
        content_type: "mindset",
        module_type: "psychology",
        duration_minutes: 18,
        difficulty_level: "intermediate",
        content_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        key_concepts: [
          "Ego recognition",
          "Emotional regulation",
          "Growth mindset",
          "Failure as teacher"
        ],
        learning_objectives: [
          "Identify ego patterns",
          "Transform resistance",
          "Embrace challenges",
          "Learn from setbacks"
        ]
      }
    }
  ]

  // Create sample products
  const allSampleContent = [
    ...sampleTechniques,
    ...sampleFlowSessions, 
    ...sampleMindsetModules
  ]

  for (const content of allSampleContent) {
    try {
      const result = await productService.createProducts([content])
      console.log(`✅ Created content: ${content.title}`)
    } catch (error) {
      console.log(`❌ Failed to create content ${content.title}:`, error)
    }
  }

  // Sample e-commerce products
  const sampleMerchandise = [
    {
      title: "Fluvium Training Gi - Black",
      handle: "fluvium-gi-black",
      description: "Premium BJJ gi designed for the modern warrior. Lightweight, durable, and built for performance.",
      status: "published",
      metadata: {
        content_type: "merchandise",
        material: "100% cotton",
        weight: "550gsm",
        sizes: ["A1", "A2", "A3", "A4"],
        care_instructions: "Machine wash cold, hang dry"
      }
    },
    {
      title: "Flow State Rashguard",
      handle: "flow-state-rashguard",
      description: "Moisture-wicking rashguard with Fluvium's signature design. Perfect for training and competition.",
      type: "physical_product", 
      status: "published",
      metadata: {
        content_type: "merchandise",
        material: "Polyester/Spandex blend",
        features: ["Moisture-wicking", "Flatlock seams", "Sublimated graphics"],
        sizes: ["S", "M", "L", "XL", "XXL"]
      }
    }
  ]

  for (const product of sampleMerchandise) {
    try {
      const result = await productService.createProducts([product])
      console.log(`✅ Created product: ${product.title}`)
    } catch (error) {
      console.log(`❌ Failed to create product ${product.title}:`, error)
    }
  }

  console.log("🎉 Humility DB seeding complete!")
}