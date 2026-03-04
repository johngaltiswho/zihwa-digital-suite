import { prisma } from './src/client'
import { createTechnique } from './src/techniques'

const techniquesToSeed = [
  // Guard Submissions
  {
    title: 'Triangle Choke from Closed Guard',
    slug: 'triangle-choke-closed-guard',
    description:
      'Classic submission from closed guard. Control one arm, trap it across their body, swing leg over shoulder and lock ankles to finish.',
    category: 'SUBMISSIONS' as const,
    position: 'CLOSED_GUARD' as const,
    difficultyLevel: 'BEGINNER' as const,
    youtubeId: 'dQw4w9WgXcQ', // Replace with actual YouTube ID
    durationMinutes: 8,
    instructorNotes: 'Focus on angle and hip movement for the finish',
    keyPoints: [
      'Break posture first',
      'Control one arm across',
      'Swing leg over shoulder',
      'Lock ankles and squeeze knees',
      'Angle your hips',
    ],
    isPublished: true,
  },
  {
    title: 'Armbar from Closed Guard',
    slug: 'armbar-closed-guard',
    description: 'Fundamental armbar from closed guard. Control arm, pivot hips, secure arm and extend.',
    category: 'SUBMISSIONS' as const,
    position: 'CLOSED_GUARD' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 10,
    keyPoints: [
      'Control the arm with both hands',
      'Break posture',
      'Pivot hips to 90 degrees',
      'Throw leg over face',
      'Pinch knees and extend hips',
    ],
    isPublished: true,
  },
  {
    title: 'Kimura from Closed Guard',
    slug: 'kimura-closed-guard',
    description: 'Shoulder lock submission using figure-four grip. Powerful control and submission option.',
    category: 'SUBMISSIONS' as const,
    position: 'CLOSED_GUARD' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 12,
    keyPoints: [
      'Get figure-four grip on their wrist',
      'Break posture',
      'Control their elbow',
      'Rotate their arm behind back',
      'Can use for sweeps if defended',
    ],
    isPublished: true,
  },

  // Guard Passing
  {
    title: 'Torreando Pass',
    slug: 'torreando-pass',
    description:
      'Dynamic guard pass where you control both legs and step around to side control. Fast and effective.',
    category: 'PASSING' as const,
    position: 'OPEN_GUARD' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 8,
    keyPoints: [
      'Control both pant legs',
      'Keep good posture',
      'Throw legs to one side',
      'Step around to side control',
      'Stay low and heavy',
    ],
    isPublished: true,
  },
  {
    title: 'Knee Slice Pass',
    slug: 'knee-slice-pass',
    description: 'Pressure-based pass where you drive knee across hip while controlling upper body.',
    category: 'PASSING' as const,
    position: 'HALF_GUARD' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 10,
    keyPoints: [
      'Control far shoulder and near hip',
      'Drive knee across hip',
      'Keep weight forward',
      'Clear knee line',
      'Establish side control',
    ],
    isPublished: true,
  },

  // Escapes
  {
    title: 'Shrimp Escape from Side Control',
    slug: 'shrimp-escape-side-control',
    description: 'Fundamental escape using hip movement to create space and recover guard.',
    category: 'ESCAPES' as const,
    position: 'SIDE_CONTROL' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 5,
    keyPoints: [
      'Frame on hip and neck',
      'Create space with hips',
      'Shrimp away',
      'Insert knee',
      'Recover guard',
    ],
    isPublished: true,
  },
  {
    title: 'Bridge and Roll from Mount',
    slug: 'bridge-roll-mount',
    description: 'Classic mount escape using bridge to reverse position.',
    category: 'ESCAPES' as const,
    position: 'MOUNT' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 6,
    keyPoints: [
      'Trap arm and same-side foot',
      'Bridge explosively',
      'Turn into them',
      'End in their guard',
      'Time it when they post',
    ],
    isPublished: true,
  },

  // Takedowns
  {
    title: 'Double Leg Takedown',
    slug: 'double-leg-takedown',
    description: 'Fundamental wrestling takedown. Drive through both legs to take opponent down.',
    category: 'TAKEDOWNS' as const,
    position: 'STANDING' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 8,
    keyPoints: [
      'Change levels',
      'Penetration step',
      'Drive shoulder to hips',
      'Grab both legs',
      'Drive through and lift',
    ],
    isPublished: true,
  },
  {
    title: 'Osoto Gari (Major Outer Reap)',
    slug: 'osoto-gari',
    description: 'Judo throw where you reap their leg while driving them backwards.',
    category: 'TAKEDOWNS' as const,
    position: 'STANDING' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 10,
    keyPoints: [
      'Off-balance opponent backwards',
      'Control collar and sleeve',
      'Step deep to outside',
      'Reap leg while pulling',
      'Follow them to ground',
    ],
    isPublished: true,
  },

  // Transitions
  {
    title: 'Mount to Back Take',
    slug: 'mount-to-back',
    description: 'Transition from mount to back control when opponent turns to escape.',
    category: 'TRANSITIONS' as const,
    position: 'MOUNT' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 7,
    keyPoints: [
      'Anticipate their turn',
      'Hook one leg',
      'Slide knee up back',
      'Get second hook',
      'Establish back control',
    ],
    isPublished: true,
  },
  {
    title: 'Sweep to Mount from Closed Guard',
    slug: 'scissor-sweep-closed-guard',
    description: 'Scissor sweep from closed guard directly to mount position.',
    category: 'GUARD' as const,
    position: 'CLOSED_GUARD' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 8,
    keyPoints: [
      'Break posture',
      'Control sleeve and collar',
      'Scissor legs',
      'Roll them over',
      'Come up to mount',
    ],
    isPublished: true,
  },

  // Advanced Submissions
  {
    title: 'Rear Naked Choke',
    slug: 'rear-naked-choke',
    description: 'Fundamental choke from back control. High percentage finish.',
    category: 'SUBMISSIONS' as const,
    position: 'BACK' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 6,
    keyPoints: [
      'Secure back control with hooks',
      'Arm under chin',
      'Grip behind head',
      'Squeeze bicep to neck',
      'Prevent hand fighting',
    ],
    isPublished: true,
  },
  {
    title: 'Loop Choke from Closed Guard',
    slug: 'loop-choke-closed-guard',
    description: 'Sneaky choke using their own collar against them.',
    category: 'SUBMISSIONS' as const,
    position: 'CLOSED_GUARD' as const,
    difficultyLevel: 'ADVANCED' as const,
    durationMinutes: 10,
    keyPoints: [
      'Deep collar grip',
      'Pull them down',
      'Thread arm through',
      'Hip out to angle',
      'Squeeze and extend',
    ],
    isPublished: true,
  },

  // Guard Retention
  {
    title: 'Knee Shield Half Guard',
    slug: 'knee-shield-half-guard',
    description: 'Defensive half guard position with knee shield to create distance.',
    category: 'GUARD' as const,
    position: 'HALF_GUARD' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 12,
    keyPoints: [
      'Frame with knee shield',
      'Control far arm',
      'Keep them off balance',
      'Can sweep or submit',
      'Active guard retention',
    ],
    isPublished: true,
  },
  {
    title: 'Spider Guard Basics',
    slug: 'spider-guard-basics',
    description: 'Open guard using feet on biceps for control and distance management.',
    category: 'GUARD' as const,
    position: 'OPEN_GUARD' as const,
    difficultyLevel: 'INTERMEDIATE' as const,
    durationMinutes: 15,
    keyPoints: [
      'Feet on biceps',
      'Control sleeves',
      'Keep distance',
      'Active leg movement',
      'Set up sweeps and submissions',
    ],
    isPublished: true,
  },

  // Submissions from Mount
  {
    title: 'Ezekiel Choke from Mount',
    slug: 'ezekiel-choke-mount',
    description: 'Choke from mount using your own sleeve as the choking surface.',
    category: 'SUBMISSIONS' as const,
    position: 'MOUNT' as const,
    difficultyLevel: 'BEGINNER' as const,
    durationMinutes: 7,
    keyPoints: [
      'Grip inside your sleeve',
      'Blade of forearm on neck',
      'Other hand behind head',
      'Squeeze wrists together',
      'Maintain mount control',
    ],
    isPublished: true,
  },
]

async function main() {
  console.log('Seeding Humility DB technique library...')

  for (const technique of techniquesToSeed) {
    try {
      const created = await createTechnique(technique)
      console.log(`✓ Created: ${created.title}`)
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⊗ Skipped (already exists): ${technique.title}`)
      } else {
        console.error(`✗ Error creating ${technique.title}:`, error.message)
      }
    }
  }

  const count = await prisma.technique.count()
  console.log(`\n✓ Technique library seeding complete! Total techniques: ${count}`)
}

main()
  .catch((e) => {
    console.error('Error seeding techniques:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
