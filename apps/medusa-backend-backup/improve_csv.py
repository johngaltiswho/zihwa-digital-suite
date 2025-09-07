import csv
import re

# Sales Channel and Region info
SALES_CHANNEL_ID = "sc_01JV6AXCAD5RZWY01EJS6YHSWA"  # Default Sales Channel
REGION_ID = "reg_01K0DQS3RQ0FMT2YH7GZQH8YMK"  # India region

def determine_variants(name, category1):
    """Determine appropriate variants based on product name and category"""
    name_lower = name.lower()
    
    # Tees and Rashguards get clothing sizes
    if any(keyword in name_lower for keyword in ['tee', 'rashguard', 'hoodie', 'jacket', 'shorts']):
        return "XS,S,M,L,XL"
    
    # Gis and BJJ Belts get gi sizes
    if any(keyword in name_lower for keyword in ['gi', 'kimono', 'belt']):
        if 'kids' in name_lower:
            return "M0,M1,M2"  # Kids sizes
        else:
            return "A0,A1,A2,A3,A4"  # Adult gi sizes
    
    # Default: no variants (single product)
    return ""

def improve_description(name, category1, existing_desc):
    """Generate better descriptions based on product info"""
    if existing_desc and len(existing_desc.strip()) > 20:
        return existing_desc
    
    name_lower = name.lower()
    
    # Tees
    if 'tee' in name_lower:
        return f"Premium martial arts t-shirt made from high-quality materials. Perfect for training or casual wear. Features the iconic Fluvium design."
    
    # Rashguards
    elif 'rashguard' in name_lower:
        return f"Technical rashguard designed for BJJ, MMA, and grappling training. Moisture-wicking fabric with flatlock seams for maximum comfort and durability."
    
    # Gis
    elif any(keyword in name_lower for keyword in ['gi', 'kimono']):
        return f"Premium BJJ Gi made from durable pearl weave cotton. Pre-shrunk and built to withstand intense training sessions. Includes jacket and pants."
    
    # Belts
    elif 'belt' in name_lower:
        return f"Traditional BJJ belt made from durable pearl weave material. Represents your journey and dedication to the art. Built to last through years of training."
    
    # Shorts
    elif 'shorts' in name_lower:
        return f"High-performance MMA and grappling shorts with reinforced seams. Flexible fabric allows full range of motion during training."
    
    # Boxing Gloves
    elif 'gloves' in name_lower:
        return f"Professional boxing gloves crafted from premium materials. Excellent protection and comfort for training and sparring sessions."
    
    # Default description
    return f"Premium martial arts equipment from Fluvium. Designed for serious athletes who demand quality and performance."

def process_csv():
    """Process the original CSV and create improved version"""
    
    input_file = 'FluviumProduct_CSV.csv'
    output_file = 'FluviumProduct_Improved.csv'
    
    with open(input_file, 'r', encoding='utf-8') as infile, \
         open(output_file, 'w', encoding='utf-8', newline='') as outfile:
        
        reader = csv.DictReader(infile)
        
        # New fieldnames with additional columns
        fieldnames = list(reader.fieldnames) + ['sales_channel_id', 'region_id', 'variants', 'improved_description']
        
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            # Add sales channel and region
            row['sales_channel_id'] = SALES_CHANNEL_ID
            row['region_id'] = REGION_ID
            
            # Determine variants
            row['variants'] = determine_variants(row['name'], row['category1'])
            
            # Improve description
            row['improved_description'] = improve_description(
                row['name'], 
                row['category1'], 
                row.get('seo_description', '')
            )
            
            # Clean up subtitle if empty
            if not row['subtitle'].strip():
                row['subtitle'] = row['category2'] if row['category2'] else row['category1']
            
            writer.writerow(row)
    
    print(f"✅ Improved CSV created: {output_file}")
    print("🔧 Added columns: sales_channel_id, region_id, variants, improved_description")
    print("📝 Improved descriptions for products with missing descriptions")
    print("👕 Added XS,S,M,L,XL variants for tees/rashguards")
    print("🥋 Added A0,A1,A2,A3,A4 variants for gis/belts")

if __name__ == "__main__":
    process_csv()