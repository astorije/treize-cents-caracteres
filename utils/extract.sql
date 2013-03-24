COPY (
  SELECT communes_simplifiees.nomcom,
         communes_simplifiees.surf,
         communes_simplifiees.insee,
         pop90,
         communes_simplifiees.pop99,
         lon,lat,
         area_gares * 100/communes_simplifiees.area as gares, 
         tx_hlm,
         insee.DECE9909,
         
         (P09_POP0014 + P09_POP1529 * 2/3) / (P09_POP6074 + P09_POP75P) AS jeunesse,
         insee_pop.p09_pop,
         insee_pop.p99_pop,
         insee_pop.d90_pop,
         insee_pop.d82_pop,
         insee_pop.d75_pop,
         insee_pop.d68_pop,
         medrfuc10 as median,
         nb_rp_app  * 100 / (nb_rp_app + nb_rp_aut + nb_rp_mi) as tx_appart
   FROM
         communes_simplifiees
   LEFT JOIN insee on (communes_simplifiees.insee::text = insee.CODGEO)
   LEFT JOIN insee_pop on (communes_simplifiees.insee::text = insee_pop.CODGEO)
   INNER JOIN type on (communes_simplifiees.insee=type.insee)
   INNER JOIN status_occupation on (status_occupation.insee = communes_simplifiees.insee)
) to '/tmp/communes.csv' CSV HEADER
