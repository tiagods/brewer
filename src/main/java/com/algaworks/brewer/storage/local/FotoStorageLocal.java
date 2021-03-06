package com.algaworks.brewer.storage.local;

import java.io.File;
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.algaworks.brewer.storage.FotoStorage;

public class FotoStorageLocal implements FotoStorage{
	private static final Logger logger = LoggerFactory.getLogger(FotoStorageLocal.class);
	
	private Path local;
	private Path localTemporario;
	
	public FotoStorageLocal() {
		this(FileSystems.getDefault().getPath(System.getenv("HOME"), ".brewerfotos"));
	}

	public FotoStorageLocal(Path path) {
		this.local=path;
		criarPastas();
	}

	private void criarPastas() {
		try {
			Files.createDirectories(this.local);
			this.localTemporario = FileSystems.getDefault().getPath(this.local.toString(), "temp");
			Files.createDirectories(this.localTemporario);
			if(logger.isDebugEnabled()) {
				logger.debug("Pastas criadas para salvar foto.");
				logger.debug("Pastas default: "+this.local.toAbsolutePath());
				logger.debug("Pastas temporaria: "+this.localTemporario.toAbsolutePath());
				
			}
		}catch (IOException e) {
			throw new RuntimeException("Erro criando pasta para salvar foto",e);
		}
		
	}
	private String renomearArquivo(String nomeOriginal) {
		String novoNome = UUID.randomUUID().toString()+"_"+nomeOriginal;
		
		if(logger.isDebugEnabled()) {
			logger.debug(String.format("Nome original %s, Novo nome do arquivo: %s", nomeOriginal,novoNome));
		}
		return novoNome;
	}
	@Override
	public String salvarTemporiaramente(MultipartFile[] files) {
		String novoNome = null;
		if(files!=null && files.length>0) {
			MultipartFile arquivo = files[0];
			novoNome = renomearArquivo(arquivo.getOriginalFilename());
			try {
				arquivo.transferTo(new File(this.localTemporario.toAbsolutePath().toString()+FileSystems.getDefault().getSeparator()+novoNome));
			} catch (IOException e) {
				throw new RuntimeException("Erro salvando a foto na pasta temporaria");
			}
			return novoNome;
		}
		return novoNome;
	}
	
}
