import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_Supabase_Url;
const supabaseKey = process.env.REACT_APP_Supabase_Anon_Key;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function NewMarket(marketID, marketName, marketDescription, marketOwner) {

    const ID = Number(marketID);
    const Name = marketName.toString();
    const Description = marketDescription.toString();
    const Owner = marketOwner.toString();

    console.log("ID:", ID, "|| Name:", Name, "|| Description:", Description, "|| Owner:", Owner);

    // Insert data into the "markets" table
    const { data, error } = await supabase
        .from('Markets')
        .insert([
            {
                id: ID,
                name: Name,
                description: Description,
                owner: Owner,
            },
        ]);

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Market Created');
    }
}
