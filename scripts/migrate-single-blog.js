// Single blog migration script - "Can Feeding Egg Powder Help With Cat Allergies?"
// Usage: node scripts/migrate-single-blog.js

const { supabaseAdmin } = require('../src/lib/supabase')

// Convert HTML blog to Tiptap JSON format data
const blogData = {
  title: 'Can Feeding Egg Powder Help With Cat Allergies?',
  excerpt: 'A look at the science behind feeding egg powder to cats with allergies, and whether it actually works.',
  content: {
    type: 'doc',
    content: [
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'Love your cat but dread the sneezes, sniffles, and red eyes that come with it? You\'re not the only one. Millions of people struggle with cat allergies and are constantly on the lookout for relief. A viral trend has emerged online: adding egg powder to your cat\'s food to supposedly reduce their allergen output. But does it actually work? In this article, we\'ll unpack the science, explore whether this method lives up to the hype, and introduce a modern alternative that offers faster, more effective results.' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Understanding Cat Allergies: The Science Behind the Sneezes' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'Before diving into the egg powder trend, it\'s important to understand what actually causes cat allergies. This foundation will help us better evaluate what actually works.' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'What Causes Cat Allergies?' }]
      },
      {
        type: 'paragraph',
        content: [
          { 
            type: 'text', 
            text: 'The culprit behind most cat allergies is a tiny but potent protein called Fel d 1. Though Fel d 1 is only one out of a possible eight proteins that can cause cat allergies, current research suggests that Fel d 1 is reponsible for ' 
          },
          {
            type: 'text',
            marks: [{ type: 'link', attrs: { href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8721530', target: '_blank' } }],
            text: 'up to 90%'
          },
          {
            type: 'text',
            text: ' of the allergic activity seen in cat allergy sufferers. Fel d 1 is produced in cats\' '
          },
          {
            type: 'text',
            marks: [{ type: 'link', attrs: { href: 'https://www.jacionline.org/article/S0091-6749(18)31175-8/fulltext', target: '_blank' } }],
            text: 'saliva, skin, and urine'
          },
          {
            type: 'text',
            text: '. Every time cats groom themselves, Fel d 1 spreads onto their fur and as cats shed their fur, eventually to the air, your furniture, bedding, and clothes.'
          }
        ]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'To your immune system, Fel d 1 looks like a threat, even though it\'s harmless. Your body responds with inflammation and histamine release in an attempt to fight off the "invader", triggering allergy symptoms. This is the foundation of all allergy reactions: a harmless protein mistaken as a hostile object.' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'How Does Egg Powder Help: Separating Fact from Fiction' }]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Not All Egg Powder is Created Equal' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'The egg powder trick floating around on social media isn\'t about cracking a raw egg over kibble. It specifically involves egg products derived from hens that have been exposed to Fel d 1. These hens then lay eggs containing antibodies (IgY) designed to bind to and neutralize Fel d 1 when ingested by cats.' 
        }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'This isn\'t just folk wisdom. Using antibodies to neutralize Fel d 1 does have scientific backing. However, this trend has caused many to imitate and market their own egg powder without understanding the science behind it. This means that many of the egg powder products available don\'t contain the necessary IgY to be effective at neutralizing Fel d 1. Be sure to double check where the egg powder comes from before committing to a purchase!' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'The Biochemistry Behind It' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'When a cat ingests these antibodies, they work inside the cat\'s mouth to bind to Fel d 1 in the saliva before it\'s spread through grooming. This means less active Fel d 1 ends up in the environment over time. But here\'s the key: it only works while the cat continues to eat the antibody-rich food regularly, and even then, the impact is limited.' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'The Problems With Egg Powder for Cat Allergies' }]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '1. Low Antibody Concentration' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'Eggs from Fel d 1-exposed hens don\'t yield high concentrations of antibodies. That means even the most "antibody-rich" egg powders or food products are inherently limited in potency. You\'d need large amounts over extended periods just to see marginal gains.' 
        }]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: '2. Quality Control is a Major Concern' }]
      },
      {
        type: 'paragraph',
        content: [
          { 
            type: 'text', 
            text: 'Farms aren\'t labs. Antibody levels vary from egg to egg, and that inconsistency can make the whole method unpredictable. Even Purina\'s carefully developed LiveClear product only claims a maximum reduction of ' 
          },
          {
            type: 'text',
            marks: [{ type: 'link', attrs: { href: 'https://www.purina.com/pro-plan/cats/liveclear-cat-allergen-reducing-food', target: '_blank' } }],
            text: '47%'
          },
          {
            type: 'text',
            text: '—and that\'s with consistent feeding and full compliance.'
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'A More Effective Solution To Reducing Cat Allergens' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'Thankfully, modern science offers a smarter solution. One that bypasses your cat\'s food bowl entirely. Instead of relying on your cat to eat a certain product every day, what if you could neutralize the allergen itself, directly in your home?' 
        }]
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'That\'s the innovation behind '
          },
          {
            type: 'text',
            marks: [{ type: 'link', attrs: { href: 'https://pacagen.com/products/cat-allergen-neutralizing-spray', target: '_blank' } }],
            text: 'Pacagen\'s Cat Allergen Neutralizing Spray'
          },
          {
            type: 'text',
            text: '. This patent-pending spray doesn\'t try to reduce the production of Fel d 1. It disables the existing allergens that are already floating around your space. It\'s fast, direct, and more reliable.'
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: 'Key Advantages of Pacagen\'s Spray:' }]
      },
      {
        type: 'orderedList',
        attrs: { start: 1 },
        content: [
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Immediate Action' },
                  { type: 'text', text: ': Neutralizes Fel d 1 proteins in the environment, rather than waiting for diet changes to kick in.' }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Ultra Concentrated' },
                  { type: 'text', text: ': Contains pure, allergen-neutralizing proteins.' }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Proven Performance' },
                  { type: 'text', text: ': Undergoes stringent lab testing and quality control for consistent results.' }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'You Stay in Control' },
                  { type: 'text', text: ': Use it when and where you need it. Spray it on your furniture, in the air, or in specific rooms.' }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Unmatched Efficacy' },
                  { type: 'text', text: ': Neutralizes up to 98% of active cat allergens.' }
                ]
              }
            ]
          },
          {
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [
                  { type: 'text', marks: [{ type: 'bold' }], text: 'Fast-Acting Relief' },
                  { type: 'text', text: ': Noticeable results in hours, not weeks.' }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Conclusion: Embracing Effective Allergen Management' }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'Feeding your cat special egg powder might sound promising, and the science isn\'t fake. But it\'s also inconsistent and dependent on you cat\'s cooperation. For cat lovers who want real relief, Pacagen\'s neutralizing spray is a game-changer.' 
        }]
      },
      {
        type: 'paragraph',
        content: [{ 
          type: 'text', 
          text: 'You don\'t have to choose between loving your cat and living comfortably. With modern options like Pacagen, you can finally say goodbye to itchy eyes and allergy fatigue—without forcing your cat to switch foods, and without waiting weeks for relief.' 
        }]
      }
    ]
  },
  image_url: '/images/cat-with-egg.png',
  image_alt: 'Can Feeding Egg Powder Help With Cat Allergies?',
  category: 'Cat Allergies',
  slug: 'can-feeding-egg-powder-help-with-cat-allergies',
  read_time: '8 min read',
  status: 'published'
}

async function migrateSingleBlog() {
  console.log('🚀 Starting single blog migration...')
  console.log(`📰 Blog: "${blogData.title}"`)

  try {
    // 1. Validate environment variables
    console.log('🔍 Checking environment variables...')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    console.log('  ✅ Environment variables confirmed')

    // 2. Test database connection
    console.log('🔗 Testing database connection...')
    const { data: testConnection, error: connectionError } = await supabaseAdmin
      .from('blog_categories')
      .select('count')
      .limit(1)

    if (connectionError) {
      throw new Error(`Database connection failed: ${connectionError.message}`)
    }
    console.log('  ✅ Database connection successful')

    // 3. Check or create category
    console.log('📂 Processing category...')
    const categorySlug = blogData.category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-')
    
    let categoryId

    const { data: existingCategory } = await supabaseAdmin
      .from('blog_categories')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (existingCategory) {
      categoryId = existingCategory.id
      console.log(`  ✅ Category "${blogData.category}" already exists`)
    } else {
      const { data: newCategory, error: categoryError } = await supabaseAdmin
        .from('blog_categories')
        .insert({ name: blogData.category, slug: categorySlug })
        .select('id')
        .single()

      if (categoryError) {
        throw categoryError
      }

      categoryId = newCategory.id
      console.log(`  ➕ Created category "${blogData.category}"`)
    }

    // 4. Check if blog already exists
    console.log('📝 Checking if blog already exists...')
    const { data: existingBlog } = await supabaseAdmin
      .from('blogs')
      .select('id, title')
      .eq('slug', blogData.slug)
      .single()

    if (existingBlog) {
      console.log(`  ⏭️  Blog "${blogData.title}" already exists (ID: ${existingBlog.id})`)
      console.log('🎉 Migration completed - blog already in database!')
      return
    }

    // 5. 插入新博客
    console.log('📚 Inserting new blog...')
    const { data: newBlog, error: blogError } = await supabaseAdmin
      .from('blogs')
      .insert({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        category_id: categoryId,
        image_url: blogData.image_url,
        image_alt: blogData.image_alt,
        read_time: blogData.read_time,
        status: blogData.status
      })
      .select('id, title, slug, status')
      .single()

    if (blogError) {
      throw blogError
    }

    console.log(`  ✅ Successfully created blog "${newBlog.title}"`)
    console.log(`     - ID: ${newBlog.id}`)
    console.log(`     - Slug: ${newBlog.slug}`)
    console.log(`     - Status: ${newBlog.status}`)

    // 6. Verify migration results
    console.log('🔍 Verifying migration...')
    
    const { data: verifyBlog, error: verifyError } = await supabaseAdmin
      .from('blogs')
      .select(`
        id, title, slug, excerpt, status, read_time,
        category:blog_categories(id, name, slug)
      `)
      .eq('id', newBlog.id)
      .single()

    if (verifyError) {
      throw verifyError
    }

    console.log('  ✅ Blog verification successful:')
    console.log(`     - Title: ${verifyBlog.title}`)
    console.log(`     - Category: ${verifyBlog.category?.name}`)
    console.log(`     - Excerpt length: ${verifyBlog.excerpt?.length} characters`)
    console.log(`     - Read time: ${verifyBlog.read_time}`)

    console.log('🎉 Single blog migration completed successfully!')

  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
if (require.main === module) {
  migrateSingleBlog()
    .then(() => {
      console.log('✨ Migration script completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Migration script failed:', error)
      process.exit(1)
    })
}

module.exports = { migrateSingleBlog }